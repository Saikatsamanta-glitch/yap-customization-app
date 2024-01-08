module.exports = (sequelize, Sequelize) => sequelize.define('promotion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  image_key: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  result_title: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  start_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  end_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  status: {
    type: Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
