let AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'eu-central-1' });

function getScreenshot(params) {
  return new Promise((resolve, reject) => {
    lambda.invoke(params, async (error, data) => {
      console.log('invoking');
      if (error) {
        console.log(error, error.stack);
        reject(error);
      } else {
        try {
          console.log('triggered');
          resolve({
            status: data.StatusCode,
            payload: JSON.parse(data.Payload),
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
    });
  });
}

module.exports = getScreenshot;
