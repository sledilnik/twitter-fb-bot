const { v1Client } = require('./twitterClient');

const { DEFAULT } = require('./lambdaParams');
const getScreenshot = require('./getScreenshot');

const isDev = process.env.NODE_ENV === 'development';

const DELETE_DELAY = 1000;

const getLastTweet = async () => {
  const homeTimeline = await v1Client.homeTimeline();
  return homeTimeline.tweets[0];
};

const deleteTweet = async (id_str = '', callback = () => {}) => {
  if (!id_str || !callback) throw new Error('No id or callback');

  try {
    console.log('Deleting tweet with id: ', id_str);
    const { id } = await v1Client.deleteTweet(id_str);
    return callback(null, `Deleted: ${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletingTweet = async (tweet, callback) => {
  const lastTweet = await getLastTweet();
  console.log(
    'Last tweet: ',
    lastTweet.id,
    lastTweet.full_text,
    lastTweet.entities.media
  );
  console.log('Our tweet: ', tweet.id, tweet.full_text, tweet.entities.media);
  setTimeout(deleteTweet.bind(null, tweet.id_str, callback), DELETE_DELAY);
};

// tweet with default image
exports.tweetDefault = async (
  callback = () => {},
  tweetText = 'This is test!'
) => {
  const image = await getScreenshot(DEFAULT);
  if (image instanceof Error) {
    return callback(image);
  }

  try {
    const body = image?.payload?.body;
    const mediaId = await v1Client.uploadMedia(Buffer.from(body, 'base64'), {
      type: 'png',
    });

    const tweet = await v1Client.tweet(tweetText, {
      media_ids: mediaId,
    });

    isDev && (await deletingTweet(tweet, callback));

    if (!isDev)
      return callback(
        null,
        `Successfully posted default tweet! Tweet ID: ${id}`
      );
  } catch (error) {
    return callback(error);
  }
};

exports.tweetSingle = async (
  payload = {},
  callback = () => {},
  tweetText = 'This is test!'
) => {
  const image = await getScreenshot(payload);
  if (image instanceof Error) {
    return callback(image);
  }

  try {
    const body = image?.payload?.body;
    const mediaId = await v1Client.uploadMedia(Buffer.from(body, 'base64'), {
      type: 'png',
    });

    const tweet = await v1Client.tweet(tweetText, {
      media_ids: mediaId,
    });

    isDev && (await deletingTweet(tweet, callback));

    if (!isDev)
      return callback(
        null,
        `Successfully posted default tweet! Tweet ID: ${id}`
      );
  } catch (error) {
    return callback(error);
  }
};

exports.tweetMultiple = async (
  payloads = [{}],
  callback = () => {},
  tweetText = 'This is test!'
) => {
  const images = await Promise.allSettled([
    ...payloads.map(payload => getScreenshot(payload)),
  ]);

  const onlyErrors = images.filter(image => image instanceof Error);
  for (error of onlyErrors) {
    console.log(error.message);
  }
  const onlyValid = images.filter(image => !(image instanceof Error));

  const imagesBase64 = onlyValid.map(result => result.value?.payload?.body);

  try {
    const media_ids = await Promise.all([
      ...imagesBase64.map(image => {
        return v1Client.uploadMedia(Buffer.from(image, 'base64'), {
          type: 'png',
        });
      }),
    ]);

    const tweet = await v1Client.tweet(tweetText, {
      media_ids,
    });

    isDev && (await deletingTweet(tweet, callback));

    if (!isDev)
      return callback(
        null,
        `Successfully posted default tweet! Tweet ID: ${id}`
      );
  } catch (error) {
    return callback(error);
  }
};
