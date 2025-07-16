const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['checkup', 'medication', 'lab test', 'vaccination'], required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  recurrence: { type: String, enum: ['once', 'daily', 'weekly', 'custom'], default: 'once' },
  selectedDays: [{ type: String }],
  note: { type: String },
  notified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
