const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addReminder, getReminders, deleteReminder, getReminderById,updateReminder } = require('../controllers/reminderController');

router.post('/add', protect, addReminder);
router.get('/', protect, getReminders);
router.get('/:id', protect, getReminderById);
router.put('/:id', protect, updateReminder);
router.delete('/:id', protect, deleteReminder);

module.exports = router;
