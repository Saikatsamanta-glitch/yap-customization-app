/* eslint-disable no-await-in-loop */
const { decode } = require('html-entities');
const { Sequelize } = require('sequelize');
const { sequelizeManager } = require('../managers');

const { EventModel, CategoryModel, SitemapModel } = sequelizeManager;
const { SITEMAP_TYPE } = require('../consts');

const convertStringToUrlFormat = ({ data }) => {
  let eventName = data ? decode(data) : '';
  eventName = eventName.replace(/[^a-zA-Z0-9\s]/g, ' ');
  eventName = eventName.trim();
  eventName = eventName.replace(/\s+/g, '-').toLowerCase();
  return eventName;
};

const getLastCrawledTime = async ({ status }) => SitemapModel.findOne({ status });

const createSitemap = async ({
  records, root, last_crawled_at, type,
}) => {
  for (let i = 0; i < records.length;) {
    let priority;
    let changefreq;
    const name = convertStringToUrlFormat({ data: records[i].name });
    let url = 'https://yapsody.events';

    if (type === SITEMAP_TYPE.EVENT) {
      url = `${url}/events/${records[i].id}-${name}`;
      priority = 0.8;
      changefreq = 'weekly';
    } else if (type === SITEMAP_TYPE.CATEGORY) {
      url = `${url}/?category/${records[i].id}`;
      priority = 0.9;
      changefreq = 'daily';
    } else {
      url = `${records[i].url}`;
      priority = records[i].priority;
      changefreq = 'daily';
    }

    const urlElement = root.ele('url');
    urlElement.ele('loc').txt(url);

    // Format the date using toISOString()
    const lastmod = new Date(last_crawled_at).toISOString();
    urlElement.ele('lastmod').txt(lastmod);
    urlElement.ele('changefreq').txt(`${changefreq}`);
    urlElement.ele('priority').txt(`${priority}`);
    i += 1;
  }
  return root.end({ prettyPrint: true });
};

const listEventData = async ({ limit, offset }) => {
  const today = new Date();
  return EventModel.findAll({
    where: {
      end_date: {
        [Sequelize.Op.gte]: today,
      },
    },
    offset,
    limit,
  });
};

const listCategoryData = async ({ limit, offset }) => CategoryModel.findAll({
  offset,
  limit,
});

const getTotalCount = async () => {
  try {
    const totalCount = await EventModel.count();
    return totalCount;
  } catch (error) {
    console.error('Error fetching total count:', error);
    throw error; // You may want to handle or propagate the error accordingly
  }
};

const getEventCount = async () => EventModel.count({});

const getCategoryCount = async () => CategoryModel.count({});

module.exports = {
  convertStringToUrlFormat,
  createSitemap,
  listEventData,
  getTotalCount,
  listCategoryData,
  getLastCrawledTime,
  getEventCount,
  getCategoryCount,
};
