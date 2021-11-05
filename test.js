// 'https://github.com/PLhery/node-twitter-api-v2/blob/e2341e483494855221a77a56ea959f0841b34673/doc/examples.md#post-a-new-tweet-with-multiple-images'

const dotenv = require("dotenv");
dotenv.config();

const { handler } = require(".");

function run(...args) {
  const event = { queryStringParameters: { screens: null } };

  if (args.length === 1) {
    event.queryStringParameters.screens = args[0];
  }

  if (args.length > 1) {
    event.queryStringParameters.screens = args;
  }

  console.log({ event });

  const callback = (error, result) => {
    if (error) console.log(error, error.stack);
    if (result) console.log(result);
  };

  (async () => await handler(event, null, callback))();
}

run("testsToday", "HOS", "ALL");
