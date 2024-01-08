module.exports = (sequelize, Sequelize) => sequelize.define('event_organizer_map', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  organizer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
