const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const otpRoutes = require('./routes/otpRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

app.use('/auth', authRoutes);
app.use('/records', recordRoutes);
app.use('/reminders', reminderRoutes);
app.use('/share', otpRoutes);
app.use('/pdf', pdfRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
  require('./cron/cronJobs');
  app.listen(8000, () => console.log('Server running on 8000'));
}).catch(err => console.log(err));
