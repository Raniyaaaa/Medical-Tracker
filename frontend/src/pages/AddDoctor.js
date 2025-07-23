import React, { useState } from 'react';
import axios from 'axios';

const AddDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: '',
    email: '',
    specialization: '',
    consultationCharge: '',
    longitude: '',
    latitude: '',
    place: '',
    hospitalName: '',
    isAvailable: true,
    availability: [
      {
        day: 'Monday',
        timeSlots: [{ from: '', to: '' }]
      }
    ]
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDoctor((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
        },
        (err) => {
          alert('Location access denied or unavailable');
          console.error(err);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      consultationCharge: Number(doctor.consultationCharge),
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(doctor.longitude),
          parseFloat(doctor.latitude)
        ]
      },
      place: doctor.place,
      hospitalName: doctor.hospitalName,
      availability: doctor.availability,
      isAvailable: doctor.isAvailable
    };

    try {
      await axios.post('http://localhost:8000/doctor/add-doctor', payload);
      alert('Doctor added successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding doctor');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Add Doctor</h2>

      <input name="name" placeholder="Name" value={doctor.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={doctor.email} onChange={handleChange} required />

      <select name="specialization" value={doctor.specialization} onChange={handleChange} required>
        <option value="">Select Specialization</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="General Physician">General Physician</option>
        <option value="Gynecologist">Gynecologist</option>
        <option value="Neurologist">Neurologist</option>
        <option value="Orthopedic">Orthopedic</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Psychiatrist">Psychiatrist</option>
        <option value="ENT Specialist">ENT Specialist</option>
        <option value="Dentist">Dentist</option>
      </select>

      <input name="consultationCharge" placeholder="Consultation Charge" value={doctor.consultationCharge} onChange={handleChange} required />
      
      <input name="place" placeholder="Place (e.g., Kochi)" value={doctor.place} onChange={handleChange} />
      <input name="hospitalName" placeholder="Hospital/Clinic Name" value={doctor.hospitalName} onChange={handleChange} />

      <input name="longitude" placeholder="Longitude" value={doctor.longitude} onChange={handleChange} required />
      <input name="latitude" placeholder="Latitude" value={doctor.latitude} onChange={handleChange} required />
      
      <button type="button" onClick={detectLocation}>📍 Use Current Location</button>
      <br /><br />
      <button type="submit">Add Doctor</button>
    </form>
  );
};

export default AddDoctor;
