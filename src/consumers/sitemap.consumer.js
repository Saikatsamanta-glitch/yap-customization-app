const { SQS } = require('@aws-sdk/client-sqs');
const { Consumer } = require('@yapsody/lib-sqs-consumer');
const config = require('../config');
const sitemapController = require('../controller/sitemap.controller');

const handleMessage = async (message) => {
  try {
    const event = JSON.parse(message.Body);
    console.info('Message body', JSON.stringify(event));
    if (event.type === 'GenerateSitemapXml') {
      await sitemapController.generateSitemap({ event });
    }
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const queueConsumer = Consumer.create({
  queueUrl: config.AWS_SQS_ENDPOINT,
  batchSize: config.AWS_SQS_MESSAGE_LIMIT,
  handleMessage,
  sqs: new SQS({ apiVersion: config.AWS_API_VERSION, region: config.AWS_REGION }),
});

queueConsumer.on('error', (err) => {
  console.error(err);
});

queueConsumer.on('processing_error', (err) => {
  console.error(err);
});

queueConsumer.on('timeout_error', (err) => {
  console.error(err);
});

module.exports = {
  handleMessage,
  queueConsumer,
};
