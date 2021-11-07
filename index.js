const { ApiResponseError } = require("twitter-api-v2");
const twitter = require("twitter-text");
const { tweetMultiple, tweetThread } = require("./tweets");
const { POST_SCREENS } = require("./postsDict");
const {
  CARDS,
  MULTICARDS,
  CHARTS,
  CUSTOM_CHARTS,
} = require("./screenshotParams");
const invokeAwsLambda = require("./invokeAwsLambda");

const SCREENS_PAYLOAD = {
  ...CARDS,
  ...MULTICARDS,
  ...CHARTS,
  ...CUSTOM_CHARTS,
};

const SUPPORTED_SOCIAL = ["tw"];
const SUPPORTED_POST = ["lab", "hos", "epi"];

exports.handler = async (event, _, callback) => {
  const { queryStringParameters } = event;
  const post = queryStringParameters?.post;
  const social = queryStringParameters?.social;

  if (!post) throw new Error('You must provide post! ["lab" || "hos"]');
  if (!social) throw new Error('You must provide social! ["tw"]');

  if (!SUPPORTED_POST.includes(post.toLowerCase()))
    throw new Error(`Post ${post} is not supported!`);

  if (!SUPPORTED_SOCIAL.includes(social.toLowerCase()))
    throw new Error(`Social "${social}" is not supported!`);

  const { screens } = POST_SCREENS[post.toUpperCase()];

  let result;
  try {
    const postParam = {
      FunctionName: "GrabSledilnikSocialPost",
      InvocationType: "RequestResponse",
      LogType: "Tail",
      Payload: JSON.stringify({
        queryStringParameters: { post, social },
      }),
    };

    const postResponse = await invokeAwsLambda(postParam);
    if (postResponse.status !== 200)
      throw new Error(`Something went wrong during grabing tweet text!`);

    const tweetText = postResponse?.payload ?? "";
    if (!tweetText) console.warn("Tweet without text");

    const goForThread = post === "epi";

    if (!goForThread) {
      const { validRangeEnd, displayRangeEnd } = twitter.parseTweet(tweetText);
      displayRangeEnd > validRangeEnd && console.warn("Text will be truncated");

      const payloads = screens.map((screen) => SCREENS_PAYLOAD[screen]);
      result = await tweetMultiple(payloads, tweetText);
    }

    if (goForThread) {
      const splittedText = tweetText.split("\n");
      const emojis = splittedText.slice(-1);
      const lab = splittedText.slice(0, 5).concat(emojis).join("\n");
      const vacs = splittedText.slice(5, 8).concat(emojis).join("\n");
      const byAge = splittedText.slice(8, 9).concat(emojis).join("\n");
      const hos = splittedText.slice(9, 12).concat(emojis).join("\n");
      const _fifth = splittedText.slice(12, splittedText.length - 1);

      const HOSPITALS = "Stanje po bolnišnicah";
      const MUNICIPALITIES = "Po krajih";

      const byHosIndex = _fifth.findIndex((element) =>
        element.includes(HOSPITALS)
      );
      const byMunIndex = _fifth.findIndex((element) =>
        element.includes(MUNICIPALITIES)
      );

      const byHos = _fifth.slice(byHosIndex, 4).concat(emojis).join("\n");
      const byMun = _fifth
        .slice(byMunIndex, byMunIndex + 4)
        .concat(emojis)
        .join("\n");

      const payloads = screens.map((threadScreens) =>
        threadScreens.map((screen) => SCREENS_PAYLOAD[screen])
      );
      const thread = [lab, vacs, byAge, hos, byHos, byMun].map((item) => ({
        status: item,
      }));

      result = await tweetThread(payloads, thread);
    }

    if (!result) throw new Error("No result!");
    if (result instanceof Error) throw result;

    return callback(null, result);
  } catch (error) {
    if (
      error instanceof ApiResponseError &&
      error.rateLimitError &&
      error.rateLimit
    ) {
      console.log(
        `You just hit the rate limit! Limit for this endpoint is ${error.rateLimit.limit} requests!`
      );
      console.log(
        `Request counter will reset at timestamp ${error.rateLimit.reset}.`
      );
    }
    return callback(error);
  }
};

if (require.main === module) {
  console.log(
    "this module was run directly from the command line as in node xxx.js"
  );
} else {
  console.log(
    "this module was not run directly from the command line and probably loaded by something else"
  );
}
