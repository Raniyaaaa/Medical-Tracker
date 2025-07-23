const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

exports.findNearbyDoctors = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const doctors = await Doctor.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 10000,
        }
      }
    ]);

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch nearby doctors', error });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json({ message: "Doctor added successfully", doctor: savedDoctor });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.searchDoctors = async (req, res) => {
  const { place, hospital, specialization } = req.query;
  try {
    const filters = [];
    if (place) filters.push({ place: { $regex: place, $options: 'i' } });
    if (hospital) filters.push({ hospitalName: { $regex: hospital, $options: 'i' } });
    if (specialization) filters.push({ specialization: { $regex: specialization, $options: 'i' } });

    const doctors = filters.length > 0 ? await Doctor.find({ $and: filters }) : await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Search error', error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const startHour = 10;
    const endHour = 19;
    const interval = 30;
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const slot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(slot);
      }
    }

    const appointments = await Appointment.find({ doctorId: id, date });
    const bookedSlots = appointments.map(b => b.timeSlot);
    const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
