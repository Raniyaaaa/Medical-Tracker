import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ShareAccess() {
  const [email, setEmail] = useState('');

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/share/send-otp`,
        { doctorEmail: email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('OTP sent to doctor');
    } catch (err) {
      console.error(err);
      alert('Error sending OTP');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3>Share Access with Doctor</h3>
        <form onSubmit={sendOtp}>
          <input
            className="form-control my-2"
            placeholder="Doctor's Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-warning">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

export default ShareAccess;
