const {
  describe, it,
} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { handleThreadMessage, generateSitemap } = require('../src/controller/sitemap.controller');

chai.use(chaiHttp);
const { expect } = chai;

describe('testing handleThreadMessage function', async () => {
  it('Functional test of generateXml function when type is event 1', async () => {
    const message = {
      status: 'SUCCESS',
    };
    const response = await handleThreadMessage({ message });
    expect(response).equal(true);
  });

  it('Functional test of generateXml function when type is event 2', async () => {
    const message = {
      status: 'ERROR',
    };
    const response = await handleThreadMessage({ message });
    expect(response).equal(true);
  });

  it('Functional test of generateSitemap function', async () => {
    const event = {
      data: {
        data: {
          task: { metadata: { type: 1 } },
        },
      },
    };
    const response = await generateSitemap({ event });
    expect(response).equal(true);
  });
});
