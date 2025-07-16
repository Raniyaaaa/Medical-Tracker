import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function AddRecord() {
  const [form, setForm] = useState({
    title: '',
    type: 'prescription',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const API_BASE = 'http://localhost:8000';
  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const submit = async (e) => {
  e.preventDefault();

  const confirmAdd = window.confirm("Are you sure? Once added, you cannot update or delete this record.");
  if (!confirmAdd) return;

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (file) {
    console.log("FFFF", file);
    formData.append('file', file);
  }

  try {
    await axios.post(`${API_BASE}/records/add`, formData, {
      ...authHeader,
      headers: {
        ...authHeader.headers,
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Record added!');
    navigate('/dashboard');
  } catch (err) {
    alert('Error uploading record');
    console.error(err);
  }
};


  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3>Add Medical Record</h3>
        <form onSubmit={submit}>
          <input
            className="form-control my-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => 
              setForm({ ...form, title: e.target.value })}
            required
          />

          <select
            className="form-control my-2"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="prescription">Prescription</option>
            <option value="lab-report">Lab Report</option>
            <option value="vaccination">Vaccination</option>
            <option value="doctor-visit">Doctor Visit</option>
          </select>

          <textarea
            className="form-control my-2"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          ></textarea>

          <input
            className="form-control my-2"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn btn-success">Add Record</button>
        </form>
      </div>
    </div>
  );
}

export default AddRecord;
