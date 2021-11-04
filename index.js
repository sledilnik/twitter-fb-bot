const { tweetDefault, tweetSingle, tweetMultiple } = require('./tweets');
const { CARDS, MULTICARDS, CHARTS } = require('./lambdaParams');

const SCREENS_PAYLOAD = { ...CARDS, ...MULTICARDS, ...CHARTS };

exports.handler = async (event, _, callback) => {
  const { queryStringParameters } = event;
  const screens = queryStringParameters?.screens;

  const hasScreens = !!screens;
  const isString = typeof screens === 'string';
  const isArray = Array.isArray(screens);

  try {
    if (!hasScreens) {
      await tweetDefault(callback);
    }

    if (isString) {
      const payload = SCREENS_PAYLOAD[screens];
      await tweetSingle(payload, callback);
    }

    if (isArray) {
      const payloads = screens.map(screen => SCREENS_PAYLOAD[screen]);
      await tweetMultiple(payloads, callback);
    }
  } catch (error) {
    console.log(error, error.stack);
    return callback(error);
  }
};

if (require.main === module) {
  console.log(
    'this module was run directly from the command line as in node xxx.js'
  );
} else {
  console.log(
    'this module was not run directly from the command line and probably loaded by something else'
  );
}
