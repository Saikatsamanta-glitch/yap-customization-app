module.exports = (sequelize, Sequelize) => sequelize.define('ticket_offer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  low_price: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  high_price: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  currency: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  valid_from: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  availability: {
    type: Sequelize.TINYINT(1),
    allowNull: true,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
