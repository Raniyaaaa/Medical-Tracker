const express = require('express');
const { findNearbyDoctors, addDoctor, searchDoctors, getDoctorById, getAvailableSlots } = require('../controllers/doctorController');
const router = express.Router();

router.get('/nearby', findNearbyDoctors);
router.post('/add-doctor', addDoctor);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getAvailableSlots);
module.exports = router;
