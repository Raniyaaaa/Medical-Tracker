import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { load } from "@cashfreepayments/cashfree-js";

function BookAppointment() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/doctor/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Error fetching doctor:', err);
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      try {
        setSlotLoading(true);
        const res = await axios.get(`http://localhost:8000/doctor/${id}/slots?date=${date}`);
        setAvailableSlots(res.data.availableSlots || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setSlotLoading(false);
      }
    };
    fetchSlots();
  }, [date, id]);

  const isSlotInFuture = (slot) => {
    const [slotHours, slotMinutes] = slot.split(":").map(Number);
    const now = new Date();
    const slotTime = new Date(`${date}T${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}:00`);
    return slotTime > now;
  };

  const handlePayment = async () => {
    if (!selectedSlot || !date) {
      alert("Please choose a date and time slot");
      return;
    }

    setLoading(true);
    try {
      const cf = await load({ mode: "sandbox" });

      const res = await fetch('http://localhost:8000/appointment/payment/create', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: id,
          doctorName: doctor.name,
          amount: doctor.consultationCharge,
          date,
          timeSlot: selectedSlot
        }),
      });

      const data = await res.json();

      if (data.paymentSessionId) {
        cf.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_modal",
        });

        setTimeout(() => pollPaymentStatus(data.orderId), 5000);
      } else {
        alert("Payment could not be initiated.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong during payment.");
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (orderId, attempt = 1) => {
    const maxAttempts = 10;
    const delay = Math.min(3000 * attempt, 15000);

    try {
      const response = await fetch('http://localhost:8000/appointment/payment/verify', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await response.json();
      if (data.latestStatus === "PAID") {
        alert("Payment Successful! Your appointment is confirmed.");
        navigate('/dashboard');
        return;
      }

      if (data.latestStatus === "FAILED") {
        alert("Payment Failed. Please try again.");
        return;
      }

      if (attempt < maxAttempts) {
        setTimeout(() => pollPaymentStatus(orderId, attempt + 1), delay);
      } else {
        alert("Payment status unknown. Please check your dashboard.");
      }
    } catch (error) {
      console.error("Error polling status:", error);
      if (attempt < maxAttempts) {
        setTimeout(() => pollPaymentStatus(orderId, attempt + 1), delay);
      }
    }
  };

  return (
    <div className="container mt-5">
      {doctor ? (
        <div className="card shadow p-4">
          <h3 className="mb-3 text-center">Book Appointment with Dr. {doctor.name}</h3>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Consultation Fee:</strong> ₹{doctor.consultationCharge}</p>

          <div className="mb-3">
            <label className="form-label"><strong>Select Date:</strong></label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {date && (
            <div className="mb-3">
              <label className="form-label"><strong>Available Slots:</strong></label>
              {slotLoading ? (
                <div className="spinner-border text-primary" role="status"></div>
              ) : availableSlots.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {availableSlots
                    .filter(slot => {
                      const today = new Date().toISOString().split('T')[0];
                      return date === today ? isSlotInFuture(slot) : true;
                    })
                    .map(slot => (
                      <button
                        key={slot}
                        className={`btn ${selectedSlot === slot ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                </div>
              ) : (
                <p className="text-danger">All slots are booked for this day. Try another date.</p>
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <button
              className="btn btn-primary px-4"
              disabled={!selectedSlot || loading}
              onClick={handlePayment}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : "Proceed to Payment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading doctor information...</p>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
