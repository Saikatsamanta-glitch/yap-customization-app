module.exports = (sequelize, Sequelize) => sequelize.define('sitemap', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  source: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  sitemap_url: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  logo: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  last_crawled_at: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
