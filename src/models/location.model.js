module.exports = (sequelize, Sequelize) => sequelize.define('location', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  city: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  state: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  country: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  postal_code: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  latitude: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  longitude: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
