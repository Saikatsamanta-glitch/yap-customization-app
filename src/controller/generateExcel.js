const { Sequelize } = require("sequelize");
const { sequelizeManager } = require("../managers");
const { EventModel, LocationModel, SitemapModel, EventSitemapMapModel } =
  sequelizeManager;
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("MySheet");

const generateExcelData = async (req, res, next) => {
  const include = [];
  include.push({
    model: SitemapModel,
    attributes: ["name"],
    required: true,
  });
//   include.push({
//     model: EventSitemapMapModel,
//     attributes: ["event_url"],
//     required: true,
//   });
  include.push({
    model: LocationModel,
    attributes: ["address"],
    required: true,
  });
  const data = await EventModel.findAll({
    include,
    attributes: ["start_date", "end_date"],
  });
  console.log(data);
  res.json({ message: data });
};

module.exports = { generateExcelData };
