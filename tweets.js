const { v1Client } = require("./twitterClient");

const { DEFAULT } = require("./lambdaParams");
const getScreenshot = require("./getScreenshot");

const DELETE_DELAY = 1000;

// eslint-disable-next-line no-unused-vars
const getLastTweet = async () => {
  const homeTimeline = await v1Client.homeTimeline();
  return homeTimeline.tweets[0];
};

const deleteTweet = async (id_str = "") => {
  if (!id_str) throw new Error('Missing arg "id_str"');

  console.log("Deleting tweet with id_str: ", id_str);
  const tweet = await v1Client.deleteTweet(id_str);
  return tweet;
};

const deletingTweet = async (tweet) => {
  console.log(
    `After ${DELETE_DELAY}ms tweet with id_str: ${tweet.id_str} should be deleted!`
  );

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        await deleteTweet(tweet.id_str);
        resolve(`Tweet with id_str: ${tweet.id_str} was deleted!`);
      } catch (error) {
        reject(error);
      }
    }, DELETE_DELAY);
  });
};

const getResult = async (tweet) => {
  const isDev = process.env.NODE_ENV === "development";
  console.log("Development mode: ", isDev);
  let message = "Success!";
  if (isDev) {
    try {
      message = await deletingTweet(tweet);
      return { message, tweet };
    } catch (error) {
      return { message: error.message, error };
    }
  }

  return { message, tweet };
};

// tweet with default image
exports.tweetDefault = async (tweetText = "Tweet with default image!") => {
  console.log("tweetDefault");
  try {
    const image = await getScreenshot(DEFAULT);
    if (image instanceof Error) {
      throw image;
    }

    const body = image?.payload?.body;
    const mediaId = await v1Client.uploadMedia(Buffer.from(body, "base64"), {
      type: "png",
    });

    const tweet = await v1Client.tweet(tweetText, {
      media_ids: mediaId,
    });

    const result = await getResult(tweet);
    return result;
  } catch (error) {
    return { message: error.message, error };
  }
};

exports.tweetSingle = async (awsImageParams = {}, tweetText = "") => {
  console.log("tweetSingle");
  const Payload = JSON.parse(awsImageParams.Payload);
  const { type, screen } = Payload;
  tweetText = tweetText
    ? tweetText
    : `Tweet with type: ${type}, screen: ${screen}`;

  const image = await getScreenshot(awsImageParams);
  if (image instanceof Error) {
    throw image;
  }

  try {
    const body = image?.payload?.body;
    const mediaId = await v1Client.uploadMedia(Buffer.from(body, "base64"), {
      type: "png",
    });

    const tweet = await v1Client.tweet(tweetText, {
      media_ids: mediaId,
    });

    const result = await getResult(tweet);
    return result;
  } catch (error) {
    return { message: error.message, error };
  }
};

exports.tweetMultiple = async (awsImagesParams = [{}], tweetText = "") => {
  console.log("tweetMultiple");
  const images = await Promise.allSettled([
    ...awsImagesParams.map((payload) => getScreenshot(payload)),
  ]);

  const onlyErrors = images.filter((image) => image instanceof Error);
  for (const error of onlyErrors) {
    console.warn("Could some/all images!");
    console.log(error.message);
  }
  const onlyValid = images.filter((image) => !(image instanceof Error));

  const imagesBase64 = onlyValid.map((result) => result.value?.payload?.body);

  try {
    const media_ids = await Promise.all([
      ...imagesBase64.map((image) =>
        v1Client.uploadMedia(Buffer.from(image, "base64"), {
          type: "png",
        })
      ),
    ]);

    const tweet = await v1Client.tweet(tweetText, {
      media_ids,
    });

    const result = await getResult(tweet);
    return result;
  } catch (error) {
    return { message: error.message, error };
  }
};
