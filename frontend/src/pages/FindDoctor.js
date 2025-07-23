import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [manualLocation, setManualLocation] = useState('');
  const [hospital, setHospital] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    handleNearbySearch();
  }, []);

  const handleNearbySearch = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get('http://localhost:8000/doctor/nearby', {
            params: { latitude, longitude }
          });
          setDoctors(res.data);
        } catch (error) {
          console.error('Error fetching nearby doctors:', error);
        }
      },
      (err) => {
        alert('Location access denied.');
        console.error(err);
      }
    );
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:8000/doctor/search', {
        params: {
          place: manualLocation || undefined,
          hospital: hospital || undefined,
          specialization: specialization || undefined
        }
      });
      setDoctors(res.data);
    } catch (err) {
      console.error('Search error:', err);
      alert('No matching doctors found or server error.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Find a Doctor</h2>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Location (e.g., Kochi)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Hospital or Clinic"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
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
        </div>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4">
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        <button className="btn btn-secondary" onClick={handleNearbySearch}>📍 Nearby Doctors</button>
      </div>

      <div className="row">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div className="col-md-4 mb-4" key={doc._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Dr. {doc.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{doc.specialization}</h6>
                  <p className="card-text">
                    <strong>Hospital:</strong> {doc.hospitalName}<br />
                    <strong>Fee:</strong> ₹{doc.consultationCharge}
                  </p>
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/book-appointment/${doc._id}`)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No doctors found.</p>
        )}
      </div>
    </div>
  );
}

export default FindDoctors;
