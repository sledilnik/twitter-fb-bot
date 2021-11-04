// 'https://github.com/PLhery/node-twitter-api-v2/blob/e2341e483494855221a77a56ea959f0841b34673/doc/examples.md#post-a-new-tweet-with-multiple-images'

const dotenv = require('dotenv');
dotenv.config();

const { handler } = require('.');

function run(...args) {
  const event = { queryStringParameters: { screens: '' } };
  console.log(event);

  if (args.length === 1) {
    event.queryStringParameters.screens = args[0];
  }

  if (args.length > 1) {
    event.queryStringParameters.screens = args;
  }

  const callback = (error, result) => {
    if (error) console.log(error, error.stack);
    if (result) console.log('Success!', result);
  };

  (async () => await handler(event, null, callback))();
}

run('DailyComparison');
