const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { queueConsumer } = require('../src/consumers/sitemap.consumer');

chai.use(chaiHttp);
const { expect } = chai;
const app = require('../src/app');

describe('Test app', () => {
  it('it should return "pong"', async () => {
    const response = await chai.request(app)
      .get('/')
      .set({
        'whitelabel-id': 1,
        'account-id': 1,
        'user-id': 1,
        'product-id': 7,
      });
    expect(response.body).to.have.property('message').equal('pong');
  });

  it('should create contact queue consumer', async () => {
    expect(queueConsumer).to.not.equal(null);
  });
});
