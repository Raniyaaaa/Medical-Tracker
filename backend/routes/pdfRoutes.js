const express = require('express');
const { downloadPdf } = require('../controllers/pdfController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/download', protect, downloadPdf);

module.exports = router;
