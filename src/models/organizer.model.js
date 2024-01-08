module.exports = (sequelize, Sequelize) => sequelize.define('organizer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  website_url: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  logo: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
