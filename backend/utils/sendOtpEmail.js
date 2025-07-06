const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp, expiresAt) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const expiryIST = expiresAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  await transporter.sendMail({
    from: `"MedTrack" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'MedTrack OTP for Viewing Records',
    html: `
      <p>Your OTP is <strong>${otp}</strong>.</p>
      <p>This OTP is valid until <strong>${expiryIST}</strong> IST (10 minutes).</p>
    `
  });
};

module.exports = sendOtpEmail;
