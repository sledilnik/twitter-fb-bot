const { TwitterApi } = require("twitter-api-v2");

const {
  TWITTER_API_KEY,
  TWITTER_API_KEY_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

const client = new TwitterApi({
  appKey: TWITTER_API_KEY,
  appSecret: TWITTER_API_KEY_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
});

exports.rwClient = client.readWrite;
exports.v1Client = this.rwClient.v1;
