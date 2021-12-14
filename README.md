# twitter-fb-bot

It's made for AWS Lambda.

Create `.env` file with appropriate secrets. See `.env.example`.

You can post 5 tweets:

- LAB
- HOS
- EPI
- EPI_HOS
- EPI_MUN

This function is calling two AWS Lambda function:

1. [GrabSledilnikSocialPost](https://github.com/jalezi/GrabSledilnikSocialPost)
2. [sledilnikScreenshot](https://github.com/jalezi/sledilnik-screenshots)

Facebook is not supported at the moment.

## Deploying to AWS Lambda

Just push to master.

In case you want to push to different AWS Lambda. Create AWS Lambda on [AWS](https://aws.amazon.com/console/).
Change the name in `.github/workflow/main.yml` to match your AWS Lambda name.
Create two env variables in secrets in your github repo:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## Development

AWS Lambda requires node version 14.x. If you want to use different version of node, just delete `.nvmrc`, `.npmrc` and
in `package.json` `"node": "14.x"` in `engines` field

Run `yarn` to install.

⚠️ Setting `NODE_ENV=development` in `.env` will post tweet and delete it. If not you have to delete tweet manually.

Better solution to test it is to create [fake/temporary twitter account](http://www.ragorder.com/twitter-test-account-testing-the-twitter-api-with-a-temporary-account/).
I haven't tried but with temp account you don't have to worry about deleting tweets.

Run `node test.js`.

Check `postsDict.js` for possible tweets.
