import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

function AddReminder() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    type: 'checkup',
    date: '',
    time: '',
    recurrence: 'once',
    selectedDays: [],
    note: ''
  });

  useEffect(() => {
    if (id) {
      API.get(`/reminders/${id}`).then(res => {
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
      }).catch(() => alert('Error fetching reminder'));
    }
  }, [id]);

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
        await API.put(`/reminders/${id}`, form);
        alert('Reminder updated!');
      } else {
        await API.post('/reminders/add', form);
        alert('Reminder added!');
      }
      window.location.href = '/dashboard';
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
          <input className="form-control my-2" placeholder="Title"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <select className="form-control my-2" value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="checkup">Checkup</option>
            <option value="medication">Medication</option>
          </select>

          <input className="form-control my-2" type="date" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })} required />

          <input className="form-control my-2" type="time" value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })} required />

          <label className="mt-2">Repeat</label>
          <select className="form-control my-2" value={form.recurrence}
            onChange={(e) => setForm({ ...form, recurrence: e.target.value })}>
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

          <textarea className="form-control my-2" placeholder="Note"
            value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}></textarea>

          <button className="btn btn-primary">{id ? 'Update' : 'Add'} Reminder</button>
        </form>
      </div>
    </div>
  );
}

export default AddReminder;
