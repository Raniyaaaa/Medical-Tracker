const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['UPCOMING', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' },
  paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'REFUNDED'], default: 'PENDING' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
