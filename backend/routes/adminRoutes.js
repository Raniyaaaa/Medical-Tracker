// routes/adminRoutes.js
const express = require('express');
const { addDoctor } = require('../controllers/adminController');
const router = express.Router();

router.post('/add-doctor', addDoctor);

module.exports = router;
