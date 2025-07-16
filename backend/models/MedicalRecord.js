const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['prescription', 'lab-report', 'vaccination', 'doctor-visit'], required: true },
  notes: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
