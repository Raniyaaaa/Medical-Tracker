const OtpAccess = require('../models/OtpAccess');
const MedicalRecord = require('../models/MedicalRecord');
const sendOtpEmail = require('../utils/sendOtpEmail');

exports.sendOtp = async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const newOtp = new OtpAccess({
      user: req.user._id,
      doctorEmail,
      otp,
      expiresAt
    });

    await newOtp.save();
    await sendOtpEmail(doctorEmail, otp, expiresAt);

    res.status(200).json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { doctorEmail, otp } = req.body;

    const nowIST = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const valid = await OtpAccess.findOne({
      doctorEmail,
      otp,
      expiresAt: { $gt: nowIST }
    }).populate('user');

    if (!valid) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    const records = await MedicalRecord.find({ user: valid.user._id });

    res.status(200).json({
      patient: valid.user.name,
      verifiedAt: nowIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      records
    });
  } catch (err) {
    console.error('OTP Verify Error:', err);
    res.status(500).json({ error: err.message });
  }
};
