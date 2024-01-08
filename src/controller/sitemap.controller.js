const path = require('path');
const { Worker } = require('worker_threads');

const handleThreadMessage = ({ message }) => {
  if (message.status === 'SUCCESS') {
    console.log('Sitemap generated successfully.');
  }

  if (message.status === 'ERROR') {
    console.log('Error in sitemap generation.');
  }
  return true;
};

const generateSitemap = async ({ event }) => {
  console.log('Generate sitemap');
  const { data } = event.data;
  const { metadata } = data.task;
  console.info('Entered in controller', metadata);
  const workerPath = path.resolve('src/threads/sitemap.thread.js');
  const workerThread = new Worker(workerPath, {
    workerData: {
      type: metadata.type,
    },
  });

  workerThread.on('message', async (msg) => {
    await handleThreadMessage({
      message: msg,
    });

    workerThread.terminate();
  });

  return true;
};

module.exports = {
  generateSitemap,
  handleThreadMessage,
};
