const express = require('express');
const { generateExcelData } = require('../controller/generateExcel');
const route = express.Router({});

// /generateExcel
route.get('/', generateExcelData);


module.exports = route;