const ExcelJS = require("exceljs");
const { decode } = require("html-entities");
const workbook = new ExcelJS.Workbook();

const service = require("../services");

const convertStringToUrlFormat = ({ data }) => {
  let eventName = data ? decode(data) : "";
  eventName = eventName.replace(/[^a-zA-Z0-9\s]/g, " ");
  eventName = eventName.trim();
  eventName = eventName.replace(/\s+/g, "-").toLowerCase();
  return eventName;
};

const createExcelFile = async (data, batchIndex, worksheet) => {
  // Create headers dynamically from the first data object
  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 80,
  }));
  // Add data rows for the current batch
  data.forEach((rowData) => {
    worksheet.addRow(rowData);
  });
  // Save the workbook to a file
  const fileName = `events_batch.xlsx`;
  await workbook.xlsx.writeFile(fileName);
};


const generateExcelData = async (req, res, next) => {
  const details = await service.generateDataExcel();
//   console.log(details);
  // https://yapsody.events/events/1363-swot-day-perioperative-care-event-tickets-swot-education-yapsody
  const dataArray = details.map((data) => {
    // Extracting required fields

    const { start_date, end_date, sitemaps, location, name, id } = data;
    const urlname = convertStringToUrlFormat({ data: name });
    const url = "https://yapsody.events";
    const event_url = `${url}/events/${id}-${urlname}`;
    const names = sitemaps[0].name;
    const { country, country_id, city, city_id } = location;

    // Creating a new object with required fields
    return {
      name,
      start_date,
      end_date,
      names,
      city,
      city_id,
      country,
      country_id,
      event_url,
    };
  });
  const batchSize = 1000; // Set the batch size as needed
  // Create batches and process data
  const processDataInBatches = async () => {
    const worksheet = workbook.addWorksheet("Events");
    const totalRecords = dataArray.length;
    console.log(totalRecords);
    let start = 0;
    let end = batchSize;

    let batchIndex = 1;

    while (start < totalRecords) {
      const currentBatch = dataArray.slice(start, end);
      await createExcelFile(currentBatch, batchIndex, worksheet);
      start = end;
      end = Math.min(end + batchSize, totalRecords);
      batchIndex++;
    }
    console.log(` Excel file created successfully!`);
  };
  // Execute the batch processing
  processDataInBatches();

  res.json({ message: "Successfully job ran" });
};

module.exports = { generateExcelData };
