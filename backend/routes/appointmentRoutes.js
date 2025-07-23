const express = require('express');
const router = express.Router();
const {
  createPaymentLink,
  verifyPaymentAndConfirm,
  getUserAppointments,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserAppointments);
router.post('/payment/create', protect, createPaymentLink);
router.post('/payment/verify', protect, verifyPaymentAndConfirm);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
