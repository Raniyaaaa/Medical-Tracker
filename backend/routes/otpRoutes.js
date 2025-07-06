const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', protect, sendOtp);        // Patient triggers
router.post('/verify-otp', verifyOtp);             // Doctor uses OTP

module.exports = router;
