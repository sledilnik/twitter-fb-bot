const { tweetMultiple } = require("./tweets");
const { POST_SCREENS } = require("./postsDict");
const { CARDS, MULTICARDS, CHARTS } = require("./screenshotParams");
const invokeAwsLambda = require("./invokeAwsLambda");

const SCREENS_PAYLOAD = { ...CARDS, ...MULTICARDS, ...CHARTS };

const SUPPORTED_SOCIAL = ["tw"];
const SUPPORTED_POST = ["lab", "hos"];

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

    const { screens } = POST_SCREENS[post.toUpperCase()];
    const payloads = screens.map((screen) => SCREENS_PAYLOAD[screen]);

    result = await tweetMultiple(payloads, tweetText);

    if (!result) throw new Error("No result!");
    if (result instanceof Error) throw result;

    return callback(null, result);
  } catch (error) {
    console.log(error, error.stack);
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
