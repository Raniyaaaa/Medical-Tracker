const express = require('express');
const { addRecord, getRecords, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/add', protect, memoryUpload.single('file'), addRecord);
router.get('/', protect, getRecords);
router.delete('/:id', protect, deleteRecord);

module.exports = router;
