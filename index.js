const { ApiResponseError } = require("twitter-api-v2");
const twitter = require("twitter-text");
const { tweetMultiple, tweetThread } = require("./tweets");
const { POST_SCREENS } = require("./postsDict");
const {
  CARDS,
  MULTICARDS,
  CHARTS,
  CUSTOM_CHARTS,
  CARDS_EMBED,
} = require("./screenshotParams");
const invokeAwsLambda = require("./invokeAwsLambda");

const THREAD_STATUS = require("./threadStatus.js");

const SCREENS_PAYLOAD = {
  ...CARDS,
  ...MULTICARDS,
  ...CHARTS,
  ...CUSTOM_CHARTS,
  ...CARDS_EMBED,
};

const SUPPORTED_SOCIAL = ["tw"];
const SUPPORTED_POST = [
  "lab",
  "hos",
  "epi",
  "epi_hos",
  "epi_mun",
  "lab_w",
  "epi_w",
];
const SUPPORTED_GO_FOR_THREAD = ["epi", "epi_hos", "epi_mun", "epi_w"];

const NO_SPLIT = ["LAB_W", "EPI_W"];

const validate = ({ post, social }) => {
  if (!social) throw new Error('You must provide social! ["tw"]');

  if (!SUPPORTED_SOCIAL.includes(social.toLowerCase()))
    throw new Error(`Social "${social}" is not supported! ["tw"]`);

  if (!post)
    throw new Error(
      'You must provide post! ["lab" || "hos" || "epi" || "epi_hos" || "epi_mun" || "lab_w" || "epi_w]'
    );

  if (!SUPPORTED_POST.includes(post.toLowerCase()))
    throw new Error(
      `Post ${post} is not supported! ["lab" || "hos" || "epi", "epi_hos" || "epi_mun" || "lab_w" || epi_w]`
    );
};

exports.handler = async (event, _, callback) => {
  if (!event.queryStringParameters) {
    return callback(undefined, "No-target");
  }

  const post = event.queryStringParameters?.post;
  const social = event.queryStringParameters?.social;
  try {
    validate({ post, social });
  } catch (error) {
    callback(undefined, error?.message ?? "Something went wrong!");
  }
  const { screens } = POST_SCREENS[post.toUpperCase()];

  let result;
  try {
    const postQueryParam = NO_SPLIT.includes(post) ? post : post.split("_")[0];
    const postParam = {
      FunctionName: "GrabSledilnikSocialPost",
      InvocationType: "RequestResponse",
      LogType: "Tail",
      Payload: JSON.stringify({
        queryStringParameters: { post: postQueryParam, social },
      }),
    };

    const postResponse = await invokeAwsLambda(postParam);
    if (postResponse.status !== 200)
      throw new Error(`Something went wrong during grabing tweet text!`);

    const tweetText = postResponse?.payload ?? "";
    if (!tweetText) console.warn("Tweet without text");

    if (tweetText.includes("❌")) {
      console.log("tweet:\n", tweetText);
      throw new Error("Tweet text contains ❌");
    }

    const goForThread = SUPPORTED_GO_FOR_THREAD.includes(post.toLowerCase());

    if (!goForThread) {
      const { validRangeEnd, displayRangeEnd } = twitter.parseTweet(tweetText);
      displayRangeEnd > validRangeEnd && console.warn("Text will be truncated");

      const payloads = screens.map((screen) => SCREENS_PAYLOAD[screen]);
      result = await tweetMultiple(payloads, tweetText);
    }

    if (goForThread) {
      const payloads = screens.map((threadScreens) =>
        threadScreens.map((screen) => SCREENS_PAYLOAD[screen])
      );

      const makeThreadStatus = THREAD_STATUS[post.toUpperCase()];
      const thread = makeThreadStatus(tweetText);

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
