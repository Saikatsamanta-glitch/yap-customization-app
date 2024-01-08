const { STATUS } = require('../consts');

module.exports = (sequelize, Sequelize) => sequelize.define('event', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  name_hash: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(255),
  },
  image_url: {
    type: Sequelize.STRING(1000),
  },
  thumbnail: {
    type: Sequelize.STRING(1000),
  },
  location_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  start_date: {
    type: Sequelize.DATE,
  },
  end_date: {
    type: Sequelize.DATE,
  },
  start_date_tz_offset: {
    type: Sequelize.STRING(45),
    allowNull: true,
  },
  attendance_mode: {
    type: Sequelize.TINYINT(1),
    allowNull: false,
  },
  status: {
    type: Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: STATUS.ENABLED,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
