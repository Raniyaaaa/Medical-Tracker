import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import {FaFileDownload, FaPenAlt, FaTrashAlt } from 'react-icons/fa';

function Dashboard() {
  const [records,setRecords] = useState([]);
  const [reminders,setReminders] = useState([]);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8000';
  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE}/records`,authHeader)
      .then(res => setRecords(res.data))
      .catch(err =>console.error(err));
    axios.get(`${API_BASE}/reminders`, authHeader)
      .then(res => setReminders(res.data))
      .catch(err =>console.error(err));
  }, [])


  const deleteReminder = async (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try{
        await axios.delete(`${API_BASE}/reminders/${id}`, authHeader);
        setReminders(reminders.filter(rem =>rem._id !== id));
      }catch(err) {
        alert('Error deleting reminder');
      }
    }
  }

  const editReminder = (id) => {
    navigate(`/edit-reminder/${id}`);
  }

  const downloadPdf = () => {
    axios.get(`${API_BASE}/pdf/download`, {
      ...authHeader,
      responseType: 'blob'
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'medtrack-records.pdf');
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3>Your Medical Records</h3>
        <button onClick={downloadPdf} 
        className="btn btn-outline-primary my-2">
          <FaFileDownload className="me-2" /> 
          Download PDF</button>
        {records.map(rec => (
          <div key={rec._id} className="card my-2">
            <div className="card-body">
              <h5>{rec.title} ({rec.type})</h5>
              <p>{rec.notes}</p>
              <small>
                {new Date(rec.date).toLocaleDateString()}</small><br />
              {rec.fileUrl && 
              <a href={rec.fileUrl} target="_blank" >View File</a>}
            </div>
          </div>
        ))}

        <h4 className="mt-5">Your Reminders</h4>
        {reminders.map(rem => (
          <div key={rem._id} 
          className="alert alert-info d-flex justify-content-between align-items-start">
            <div>
              <strong>{rem.title}</strong> 
              ({rem.type}) on {new Date(rem.date).toLocaleDateString()}<br />
              at {rem.time}<br />
              <small>{rem.note}</small>
            </div>
            <div>
              <button className="
              btn btn-sm btn-outline-primary me-2" 
              onClick={() => editReminder(rem._id)}>
                <FaPenAlt/></button>
              <button className="btn btn-sm btn-outline-danger" 
              onClick={() => deleteReminder(rem._id)}>
                <FaTrashAlt/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
