module.exports = (sequelize, Sequelize) => sequelize.define('sitemap_event_map', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sitemap_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  event_url: {
    type: Sequelize.STRING(1000),
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
