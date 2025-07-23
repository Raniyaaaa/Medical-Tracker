const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  specialization: String,
  consultationCharge: Number,
  hospitalName: String,
  place: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
});

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);
