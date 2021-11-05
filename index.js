const { tweetDefault, tweetSingle, tweetMultiple } = require('./tweets');
const { CARDS, MULTICARDS, CHARTS } = require('./lambdaParams');

const SCREENS_PAYLOAD = { ...CARDS, ...MULTICARDS, ...CHARTS };

exports.handler = async (event, _, callback) => {
  const { queryStringParameters } = event;
  const screens = queryStringParameters?.screens;

  const hasScreens = !!screens;
  const isString = typeof screens === 'string';
  const isArray = Array.isArray(screens);

  let result;
  try {
    if (!hasScreens) {
      console.log('No query param "screens"! Go for tweetDefault()!');
      result = await tweetDefault();
    }

    if (hasScreens && isString) {
      console.log(`Query param screens: ${screens}! Go for tweetSingle()!`);
      const payload = SCREENS_PAYLOAD[screens];
      result = await tweetSingle(payload);
    }

    if (hasScreens && isArray) {
      console.log(
        `Query param screens: ${screens
          .join(', ')
          .trimEnd()}! Go for tweetMultiple()!`
      );
      const payloads = screens.map(screen => SCREENS_PAYLOAD[screen]);
      result = await tweetMultiple(payloads);
    }

    if (!result) throw new Error('No result!');
    if (result instanceof Error) throw result;

    return callback(null, result);
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
