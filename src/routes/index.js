const express = require('express');
const router = express.Router();

router.use('/generateExcel',require('./excelsheet'))

module.exports = router;