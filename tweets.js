const { v1Client } = require("./twitterClient");

const invokeAwsLambda = require("./invokeAwsLambda");
const { getResult, uploadImages } = require("./tweetsUtils");

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
