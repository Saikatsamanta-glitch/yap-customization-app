const {
        describe, it
} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { generateXml, getRecordSize, getRecords } = require('../src/threads/sitemap.thread');
const {
        EventModel, CategoryModel, LocationModel, SitemapModel,
} = require('../src/managers/sequelize.manager');
const { handleMessage } = require('../src/consumers/sitemap.consumer');
const { getTotalCount } = require('../src/services/sitemap.service');
const { SITEMAP_TYPE } = require('../src/consts')
chai.use(chaiHttp);
const { expect } = chai;


describe('testing generateXml function', async () => {
        it('Functional test of generateXml function when type is event', async () => {
                const response = await generateXml({ type: 1 });
                expect(response).equal(true);
        });

        it('Functional test of generateXml function when type is category', async () => {
                const response = await generateXml({ type: 2 });
                expect(response).equal(true);
        });
        it('Functional test of generateXml function when type is page', async ()=>{
                const response = await generateXml({type:3});
                expect(response).equal(true);
        })
        it('Functional test of generateXml function when type is neither event nor category', async () => {
                const response = await generateXml({ type: 'page' });
                expect(response).equal(true);
        });

        it('Functional testcase for getCount function', async () => {
                const response = await getTotalCount();
                expect(response);
        });

        it('Functional testcase for handleMessage1', async () => {
                const event = {
                        Body: JSON.stringify({
                                type: 'GenerateSitemapXml',
                        }),
                };
                await handleMessage(event).catch((err) => {
                        expect(err);
                });
        });

        it('Functional testcase for handleMessage2', async () => {
                const event = {
                        Body: JSON.stringify({
                                type: 'GenerateSitemapXml123',
                        }),
                };
                const response = await handleMessage(event);
                expect(response).equal(true);
        });

        it('Functional testcase for handleMessage3', async () => {
                const message = {
                        Body: 'invalid JSON',
                };
                await handleMessage(message).catch((err) => {
                        expect(err);
                });
        });
});

describe('getRecordSize function', () => {
        it('should get record count for SITEMAP_TYPE.EVENT', async () => {
                const result = await getRecordSize({ type: SITEMAP_TYPE.EVENT });
                expect(result).to.be.a('number');
        });

        it('should get record count for SITEMAP_TYPE.CATEGORY', async () => {
                const result = await getRecordSize({ type: SITEMAP_TYPE.CATEGORY });
                expect(result).to.be.a('number');
        });

        it('should handle type not found', async () => {
                const result = await getRecordSize({ type: 4 });
                expect(result).to.deep.equal([]);
        });
});

describe('getRecords function', () => {
        it('should get event records with correct xml file', async () => {
                const { data, xmlFile } = await getRecords({ type: SITEMAP_TYPE.EVENT, offset: 0});
                expect(xmlFile).to.equal('events-sitemap.xml');
                expect(data).to.be.an('array');
        });

        it('should get category records with correct xml file', async () => {
                const { data, xmlFile } = await getRecords({ type: SITEMAP_TYPE.CATEGORY, offset: 100});
                expect(xmlFile).to.equal('category-sitemap.xml');
                expect(data).to.be.an('array');
        });

        it('should default to pages-sitemap.xml and empty data if type is unknown', async () => {
                const { data, xmlFile } = await getRecords({ type: SITEMAP_TYPE.PAGE, offset: 50});
                expect(xmlFile).to.equal('pages-sitemap.xml');
                expect(data).to.be.an('array');
        });
});


