/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
const {
  S3Client, PutObjectCommand, GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const { Upload } = require('@aws-sdk/lib-storage');
const {
  AWS_BUCKET_NAME, AWS_REGION,
} = require('../config');

const s3Client = new S3Client({
  region: AWS_REGION,
});

// Utility function to convert a ReadableStream to a string
const streamToString = async (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  stream.on('error', (error) => reject(error));
});

const appendContentToS3File = async ({ content, fileKey }) => {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: `sitemaps/${fileKey}`,
    });
    const response = await s3Client.send(getObjectCommand);

    // Convert the existing content to a string
    const existingContent = await streamToString(response.Body);

    // Append new content to the existing content
    const newContent = existingContent + content;

    // Convert the new content to a Readable stream
    const contentStream = Readable.from([newContent]);

    // Upload the new content to S3 using the PutObjectCommand
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: AWS_BUCKET_NAME,
        Key: `sitemaps/${fileKey}`,
        Body: contentStream,
        ContentType: 'application/xml',
      },
    });

    await uploader.done();
  } catch (error) {
    throw new Error('Error in appending file to S3 :-', error);
  }
};

const writeSitemapToS3File = async ({ fileKey, content, batch }) => {
  // Call the function to append content to the existing file
  if (!batch) {
    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: `sitemaps/${fileKey}`,
      Body: content,
      ContentType: 'application/xml',
    });
    await s3Client.send(command);
  } else await appendContentToS3File({ content, fileKey });
};

module.exports = {
  writeSitemapToS3File,
  streamToString,
  appendContentToS3File,
};
