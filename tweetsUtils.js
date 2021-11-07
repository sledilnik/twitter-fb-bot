const { v1Client } = require("./twitterClient");

const invokeAwsLambda = require("./invokeAwsLambda");

const DELETE_DELAY = 1000;

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

module.exports = {
  getLastTweet,
  deleteTweet,
  deletingTweet,
  getResult,
  uploadImages,
};
