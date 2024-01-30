const { Op } = require("sequelize");
const { sequelizeManager } = require("../managers");
const { EventModel, LocationModel, SitemapModel } = sequelizeManager;

const generateDataExcel = async () => {
  const include = [
    {
      model: SitemapModel,
      attributes: ["name"],
      required: true,
    },
    {
      model: LocationModel,
      attributes: ["address"],
      required: true,
    },
  ];

  const currentDate = new Date(); // Get today's date

  const details = await EventModel.findAll({
    include,
    attributes: ["start_date", "end_date", "id", "name"],
    where: {
      end_date: {
        [Op.gte]: currentDate, // Filter where start_date is greater than or equal to today
      },
    },
    // limit: 10, // Use while testing
  });
  console.log(details);
  return details;
};

module.exports = generateDataExcel;
