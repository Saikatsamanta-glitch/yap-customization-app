const ExcelJS = require("exceljs");
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
const details = async (worksheet) => {
  worksheet.columns = [
    { header: "total Events", key: "total Events", width: 30 },
    { header: "total Yapsody Events", key: "total Yapsody Events", width: 30 },
    { header: "total Insider Events", key: "total Insider Events", width: 30 },
  ];
};
const generateExcelData = async (req, res, next) => {
  const details = await service.generateDataExcel();
  // https://yapsody.events/events/1363-swot-day-perioperative-care-event-tickets-swot-education-yapsody
  const dataArray = details.map((data) => {
    // Extracting required fields

    const { start_date, end_date, sitemaps, location, name, id } = data;
    const urlname = convertStringToUrlFormat({ data: data.name });
    let url = "https://yapsody.events";

    const { name } = sitemaps[0];
    const { address } = location;

    // Creating a new object with required fields
    return {
      start_date,
      end_date,
      event_url,
      name,
      address,
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

  res.json({ message: details });
};

module.exports = { generateExcelData };
