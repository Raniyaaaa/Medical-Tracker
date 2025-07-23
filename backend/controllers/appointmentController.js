const axios = require('axios');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg/orders";

exports.createPaymentLink = async (req, res) => {
  const { doctorId, date, timeSlot } = req.body;

  try {
    const userId = req.user._id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const orderId = `order_${Date.now()}`;

    const payload = {
      customer_details: {
        customer_id: userId,
        customer_email: "demo@example.com",
        customer_phone: "9876543210",      
      },
      order_amount: doctor.consultationCharge,
      order_currency: "INR",
      order_id: orderId,
      order_meta: {
        payment_methods: "upi,cc,dc",
      }
    };

    const response = await axios.post(CASHFREE_BASE_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    });

    const paymentSessionId = response.data?.payment_session_id;
    if (!paymentSessionId) {
      return res.status(500).json({ message: "Failed to create payment session" });
    }

    const appointment = new Appointment({
      orderId,
      doctorId,
      userId,
      date,
      timeSlot,
      paymentStatus: 'PENDING',
    });

    await appointment.save();

    res.status(200).json({ paymentSessionId, orderId });
  } catch (error) {
    console.error("Create Payment Error:", error.response?.data || error.message);
    res.status(500).json({ message: 'Payment link creation failed' });
  }
};

exports.verifyPaymentAndConfirm = async (req, res) => {
  const { order_id } = req.body;

  try {
    const appointment = await Appointment.findOne({ orderId: order_id });
    if (!appointment) {
      return res.status(404).json({ message: "Order not found" });
    }

    const response = await axios.get(`https://sandbox.cashfree.com/pg/orders/${order_id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      }
    });

    const status = response.data?.order_status;
    appointment.paymentStatus = status;
    await appointment.save();

    res.status(200).json({ latestStatus: status });
  } catch (error) {
    console.error("Verify Error:", error.response?.data || error.message);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).populate('doctorId');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};


exports.cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user._id;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    // Update status only (no real refund logic)
    appointment.status = 'CANCELLED';
    if (appointment.paymentStatus === 'PAID') {
      appointment.paymentStatus = 'REFUNDED';
    }

    await appointment.save();

    return res.status(200).json({
      message: 'Appointment cancelled and payment status updated to REFUNDED (if applicable)'
    });

  } catch (error) {
    console.error('Cancel Error:', error.message);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};
