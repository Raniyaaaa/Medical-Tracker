import {useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';

function AddReminder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: 'checkup',
    date: '',
    time: '',
    recurrence: 'once',
    selectedDays: [],
    note: ''
  });

  const API_BASE = 'http://localhost:8000';
  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE}/reminders/${id}`, authHeader)
        .then(res => {
          const { title, type, date, time, recurrence, selectedDays, note } = res.data;
          setForm({
            title,
            type,
            date: date?.split('T')[0],
            time,
            recurrence,
            selectedDays,
            note
          });
        })
        .catch(() => alert('Error fetching reminder'));
    }
  }, [id,authHeader]);

  const handleCheckboxChange = (day) => {
    setForm(prev => {
      const isSelected = prev.selectedDays.includes(day);
      const newDays = isSelected
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays: newDays };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${API_BASE}/reminders/${id}`, form, authHeader);
        alert('Reminder updated!');
      } else {
        console.log("b,zxncbasjfbajs:", form)
        await axios.post(`${API_BASE}/reminders/add`, form, authHeader);
        alert('Reminder added!');
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Error saving reminder');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3>{id ? 'Edit Reminder' : 'Add Reminder'}</h3>
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
            <option value="checkup">Checkup</option>
            <option value="medication">Medication</option>
            <option value="lab test">Lab Test</option>
            <option value="vaccination">Vaccination</option>
          </select>
          <input
            className="form-control my-2"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <input
            className="form-control my-2"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />

          <label className="mt-2">Repeat</label>
          <select
            className="form-control my-2"
            value={form.recurrence}
            onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
          >
            <option value="once">Only Once</option>
            <option value="daily">Every Day</option>
            <option value="weekly">Every Week</option>
            <option value="custom">Custom Days</option>
          </select>

          {form.recurrence === 'custom' && (
            <div className="mb-3">
              <label>Select Days:</label><br />
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <label key={day} className="mx-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={form.selectedDays.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  /> {day}
                </label>
              ))}
            </div>
          )}
          <textarea
            className="form-control my-2"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          ></textarea>
          <button className="btn btn-primary">
            {id ? 'Update' : 'Add'} Reminder
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReminder;
