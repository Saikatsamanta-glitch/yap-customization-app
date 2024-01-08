const { expect } = require('chai');
const { streamToString } = require('../src/utils/s3.utils');
const { Readable } = require('stream');
const { writeSitemapToS3File,appendContentToS3File } = require('../src/utils/s3.utils')
const {
        S3Client, PutObjectCommand, GetObjectCommand,
} = require('@aws-sdk/client-s3');
const {
        AWS_BUCKET_NAME, AWS_REGION,
} = require('../src/config');
// streamToString
class MockReadableStream {
        constructor(dataChunks) {
                this.dataChunks = dataChunks.map((chunk) => Buffer.from(chunk)); // Convert string chunks to Buffers
                this.error = null;
                this.currentIndex = 0;
        }

        on(event, callback) {
                if (event === 'data') {
                        this.dataChunks.forEach((chunk) => callback(chunk));
                } else if (event === 'end') {
                        process.nextTick(() => callback());
                } else if (event === 'error') {
                        process.nextTick(() => callback(this.error || new Error('Mock stream error')));
                }
        }

        setError(error) {
                this.error = error;
        }
}

describe('streamToString function', () => {
        it('should convert a simple stream to string', async () => {
                const dataChunks = ['Hello', ' ', 'world!'];
                const stream = new MockReadableStream(dataChunks);
                const result = await streamToString(stream);
                expect(result).to.equal('Hello world!');
        });

        it('should handle an empty stream', async () => {
                const stream = new MockReadableStream([]);
                const result = await streamToString(stream);
                expect(result).to.equal('');
        });

        it('should handle a stream error', async () => {
                const errorMessage = 'Custom stream error';
                const stream = new MockReadableStream([]);
                stream.setError(new Error(errorMessage));
                try {
                        await streamToString(stream);
                } catch (error) {
                        expect(error.message).to.equal(errorMessage);
                }
        });
});

// Mock S3 client or use a testing bucket
describe('writeSitemapToS3File function', () => {
        it('when batch is 0', async () => {
                const res = {
                        fileKey: "test",
                        content: "TESTTEXT",
                        batch: 0
                }
                const response = await writeSitemapToS3File(res);

                expect(response);
        })
        it('when batch is 1', async () => {
                const res = {
                        fileKey: "test",
                        content: "TESTTEXT",
                        batch: 1
                }
                const response = await writeSitemapToS3File(res);
                expect(response);
        })
})

describe('Error handling in appendContentToS3File', () => {
        it('should throw an error if S3 operation fails', async () => {
                try {
                        await appendContentToS3File({
                                content: 'Testcontent',
                                fileKey: 'example.xml', // Replace with your file key
                        });
                        // If no error is thrown, fail the test
                        throw new Error('Function did not throw as expected');
                } catch (error) {
                        // Assert that the error thrown matches the expected error
                        expect(error.message).to.equal('Error in appending file to S3 :-');
                       
                }
        });
});