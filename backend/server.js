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

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/share', otpRoutes);
app.use('/api/pdf', pdfRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
  require('./cron/cronJobs');
  app.listen(8000, () => console.log('Server running on 8000'));
}).catch(err => console.log(err));
