const { v1Client } = require("./twitterClient");

const { DEFAULT } = require("./screenshotParams");
const invokeAwsLambda = require("./invokeAwsLambda");

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
  if (Array.isArray(tweet)) {
    for (let tw of tweet) {
      console.log(
        `After ${DELETE_DELAY}ms tweet with id_str: ${tw.id_str} should be deleted!`
      );
    }

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const promises = tweet.map((tw) => deleteTweet(tw.id_str));
          const deletedTweets = await Promise.allSettled(promises);

          const result = deletedTweets.map((tw) => {
            if (tw.status === "rejected") {
              return new Error("Rejected");
            }
            return `Tweet with id_str: ${tw.value.id_str} was deleted!`;
          });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }, DELETE_DELAY);
  }

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

const uploadImages = async (awsImagesParams = []) => {
  const images = await Promise.allSettled([
    ...awsImagesParams.map((payload) => invokeAwsLambda(payload)),
  ]);

  const rejected = images.filter((image) => image.status === "rejected");
  for (const error of rejected) {
    console.warn("Could not get some/all images!");
    console.log(error.message);
  }

  const fullfilled = images.filter((image) => image.status === "fulfilled");

  const imagesBase64 = fullfilled.map((result) => result.value?.payload?.body);
  const media_ids = await Promise.all([
    ...imagesBase64.map((image) =>
      v1Client.uploadMedia(Buffer.from(image, "base64"), {
        type: "png",
      })
    ),
  ]);

  return media_ids;
};

// tweet with default image
exports.tweetDefault = async (tweetText = "Tweet with default image!") => {
  console.log("tweetDefault");
  try {
    const image = await invokeAwsLambda(DEFAULT);
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

// tweet with image
exports.tweetSingle = async (awsImageParams = {}, tweetText = "") => {
  console.log("tweetSingle");
  const Payload = JSON.parse(awsImageParams.Payload);
  const { type, screen } = Payload;
  tweetText = tweetText
    ? tweetText
    : `Tweet with type: ${type}, screen: ${screen}`;

  const image = await invokeAwsLambda(awsImageParams);
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

// tweet with multiple images (max twitter api media uploads: 4)
exports.tweetMultiple = async (awsImagesParams = [], tweetText = "") => {
  console.log("tweetMultiple");

  if (awsImagesParams.length > 4)
    throw new Error("Twitter doesn't allow more than 4 images!");

  try {
    const media_ids = await uploadImages(awsImagesParams);

    const tweet = await v1Client.tweet(tweetText, {
      media_ids,
    });

    const result = await getResult(tweet);
    return result;
  } catch (error) {
    return { message: error.message, error };
  }
};

// eslint-disable-next-line no-unused-vars
const sampleThread = [
  "Hello, lets talk about Twitter!",
  {
    status: "Twitter is a fantastic social network. Look at this:",
    media_ids: ["some_id"],
  },
  "This thread is automatically made with twitter-api-v2 :D",
];

// tweet thread with multiple images (max twitter api media uploads: 4)
exports.tweetThread = async (awsImagesParams = [], thread = []) => {
  console.log("tweetThread");

  const validate = awsImagesParams.some((params) => params.length > 4);
  if (validate) throw new Error("Twitter doesn't allow more than 4 images!");

  try {
    const media_ids = await Promise.allSettled(
      awsImagesParams.map((params) => uploadImages(params))
    );
    const _thread = thread.map((item, index) => {
      const status = media_ids[index]?.status;
      const value = media_ids[index]?.value;

      item.media_ids = status === "fulfilled" ? value : [];
      return item;
    });

    const tweet = await v1Client.tweetThread(_thread);

    const result = await getResult(tweet);
    return result;
  } catch (error) {
    return { message: error.message, error };
  }
};
