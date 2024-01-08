const { Sequelize } = require("sequelize");
const { sequelizeManager } = require("../managers");
const { EventModel, LocationModel, SitemapModel } = sequelizeManager;



const generateDataExcel = async () => {
  const include = [];
  include.push({
    model: SitemapModel,
    attributes: ["name"],
    required: true,
  });
  include.push({
    model: LocationModel,
    attributes: ["address"],
    required: true,
  });
  const details = await EventModel.findAll({
    include,
    attributes: ["start_date", "end_date","id","name"],
    limit: 100,
  });
  
  return details;
};

module.exports = generateDataExcel;
