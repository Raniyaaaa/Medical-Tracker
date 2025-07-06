const cron = require('node-cron');
const mongoose = require('mongoose');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('✅ Cron MongoDB connected'))
    .catch(err => console.error('❌ MongoDB Error in Cron:', err));
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// 🔁 Every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    now.setSeconds(0, 0);

    const allReminders = await Reminder.find({}).populate('user');

    for (let reminder of allReminders) {
      const { user, title, type, date, time, recurrence, selectedDays, notified } = reminder;

      // Combine date and time into a full timestamp for today
      const [hour, minute] = time.split(':');
      const reminderTimeToday = new Date(now);
      reminderTimeToday.setHours(hour, minute, 0, 0);

      const isSameTime = now.getTime() === reminderTimeToday.getTime();
      const weekdayStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

      let shouldSend = false;

      if (recurrence === 'once') {
        const scheduledDate = new Date(date);
        scheduledDate.setHours(hour, minute, 0, 0);
        if (!notified && now.getTime() === scheduledDate.getTime()) {
          shouldSend = true;
          reminder.notified = true; // Only once
        }
      } else if (recurrence === 'daily') {
        if (isSameTime) shouldSend = true;
      } else if (recurrence === 'weekly') {
        const scheduledDate = new Date(date);
        if (
          scheduledDate.getDay() === now.getDay() && isSameTime
        ) {
          shouldSend = true;
        }
      } else if (recurrence === 'custom') {
        if (selectedDays.includes(weekdayStr) && isSameTime) {
          shouldSend = true;
        }
      }

      if (shouldSend) {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: user.email,
          subject: `Reminder: ${title}`,
          text: `Don't forget your ${type} today at ${time}.\nNote: ${reminder.note || 'No note'}`
        });

        await reminder.save();
        console.log(`📧 Reminder sent to ${user.email}: ${title}`);
      }
    }
  } catch (err) {
    console.error('❌ Cron job error:', err.message);
  }
});
