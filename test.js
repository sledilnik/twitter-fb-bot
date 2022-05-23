// 'https://github.com/PLhery/node-twitter-api-v2/blob/e2341e483494855221a77a56ea959f0841b34673/doc/examples.md#post-a-new-tweet-with-multiple-images'

const dotenv = require("dotenv");
dotenv.config();

const { handler } = require(".");

function run(post, social) {
  const event = { queryStringParameters: { post, social } };

  console.log({ event });

  const callback = (error, result) => {
    if (error) console.log(error, error.stack);
    if (result) console.log(result);
    return [error, result];
  };

  (async () => await handler(event, null, callback))();
}

exports.run = run;

// twitter img preview at width 650: width: 465, height: 243.453

if (require.main === module) {
  console.log(
    "this module was run directly from the command line as in node test.js"
  );
  // Possible: LAB, HOS, EPI, EPI_HOS, EPI_MUN
  run("EPI_W", "tw");
} else {
  console.log(`require: ${module.id}`);
}
