import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/appointment', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setMessage('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirm = window.confirm('Are you sure you want to cancel and request refund?');
    if (!confirm) return;

    try {
      const res = await axios.delete(`http://localhost:8000/appointment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) => prev.filter((a) => a._id !== id));
      setMessage(res.data.message || 'Appointment cancelled successfully.');
    } catch (err) {
      console.error('Cancel Error:', err);
      setMessage('Failed to cancel appointment. Try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter((a) => a.date >= today && a.status !== 'CANCELLED');
  const history = appointments.filter((a) => a.date < today || a.status === 'CANCELLED');

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Your Appointments</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
          <section>
            <h4 className="text-success mb-3">Upcoming Appointments</h4>
            {upcoming.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              upcoming.map((a) => (
                <div key={a._id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Dr. {a.doctorId?.name}</h5>
                    <p className="card-text mb-2">
                      <strong>Date:</strong> {a.date} &nbsp; | &nbsp;
                      <strong>Time:</strong> {a.timeSlot}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong>{' '}
                      <span className="badge bg-info text-dark">{a.paymentStatus}</span>
                    </p>
                    <button
                      onClick={() => handleCancel(a._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="mt-5">
            <h4 className="text-secondary mb-3">Appointment History</h4>
            {history.length === 0 ? (
              <p>No past or cancelled appointments.</p>
            ) : (
              history.map((a) => (
                <div key={a._id} className="card mb-3 bg-light shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Dr. {a.doctorId?.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Date:</strong> {a.date} <br />
                      <strong>Time:</strong> {a.timeSlot}
                    </p>
                    <strong>Status:</strong>{' '}
                    {a.status === 'CANCELLED' ? (
                      <span className="badge bg-warning text-dark">Cancelled</span>
                    ) : (
                      <span className="badge bg-success">Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Appointments;
