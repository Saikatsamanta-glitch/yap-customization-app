/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
const { workerData, parentPort } = require('worker_threads');
const { create } = require('xmlbuilder2');
const { writeSitemapToS3File } = require('../utils/s3.utils');
const { PAGE_SITEMAP_DATA, SITEMAP_TYPE } = require('../consts');
const { sitemapService } = require('../services');

const getRecords = async ({ type, offset }) => {
  let data = [];
  let xmlFile = '';
  const limit = 25000;
  switch (type) {
    case SITEMAP_TYPE.EVENT:
      xmlFile = 'events-sitemap.xml';
      data = await sitemapService.listEventData({ limit, offset });
      break;
    case SITEMAP_TYPE.CATEGORY:
      xmlFile = 'category-sitemap.xml';
      data = await sitemapService.listCategoryData({ limit, offset });
      break;
    default:
      xmlFile = 'pages-sitemap.xml';
  }
  return { data, xmlFile };
};

const getRecordSize = async ({ type }) => {
  let recordCount = [];
  switch (type) {
    case SITEMAP_TYPE.EVENT:
      recordCount = await sitemapService.getEventCount({});
      break;
    case SITEMAP_TYPE.CATEGORY:
      recordCount = await sitemapService.getCategoryCount({});
      break;
    default:
      console.log('Type not found');
  }
  return recordCount;
};

const generateXml = async ({ type }) => {
  console.info('Entered in generateXml', type);
  const limit = 25000;
  try {
    const batchSize = Math.ceil(
      type === SITEMAP_TYPE.PAGE ? PAGE_SITEMAP_DATA.length / limit : await getRecordSize({ type }) / limit,
    );

    for (let batch = 0; batch < batchSize; batch += 1) {
      console.log('in loop');
      let data = [];
      let xmlFile;

      if (type === SITEMAP_TYPE.PAGE) {
        data = PAGE_SITEMAP_DATA.slice(batch * limit, (batch + 1) * limit);
        xmlFile = 'pages-sitemap.xml';
      } else {
        const response = await getRecords({ type, offset: batch * limit });
        data = response.data;
        xmlFile = response.xmlFile;
      }

      const root = create({ version: '1.0' })
        .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

      const { last_crawled_at } = await sitemapService.getLastCrawledTime({ status: 1 });

      const sitemapXML = await sitemapService.createSitemap({
        records: data,
        root,
        last_crawled_at,
        type,
      });

      const xmlFileSize = 80;
      if (batch > 0 && batch % xmlFileSize === 0) {
        xmlFile = (type === SITEMAP_TYPE.EVENT) ? 'events-sitemap.xml'
          : (type === SITEMAP_TYPE.CATEGORY) ? 'category-sitemap.xml' : 'pages-sitemap.xml';
      }

      console.log(xmlFile);
      await writeSitemapToS3File({ content: sitemapXML, fileKey: xmlFile, batch });
    }
    return true;
  } catch (err) {
    console.error('Error generating sitemap:', err);
    throw err;
  }
};

if (workerData) {
  const { type } = workerData;
  generateXml({ type })
    .then((res) => {
      parentPort.postMessage({
        status: 'SUCCESS',
        message: 'Sitemap generated successfully',
        data: res,
      });
    }).catch((err) => {
      parentPort.postMessage({
        status: 'ERROR',
        message: err.message,
      });
    });
}

module.exports = {
  generateXml,
  getRecordSize,
  getRecords,
};
