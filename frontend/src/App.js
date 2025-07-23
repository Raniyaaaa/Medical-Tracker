import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import AddReminder from './pages/AddReminder';
import ShareAccess from './pages/ShareAccess';
import VerifyOtp from './pages/VerifyOtp';
import BookAppointment from './pages/BookAppointment';
import FindDoctors from './pages/FindDoctor';
import AddDoctor from './pages/AddDoctor';
import Appointments from './pages/Appointments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-record" element={<AddRecord />} />
        <Route path="/edit-record/:id" element={<AddRecord />} />
        <Route path="/add-reminder" element={<AddReminder />} />
        <Route path="/edit-reminder/:id" element={<AddReminder />} />
        <Route path="/share-access" element={<ShareAccess />} />
        <Route path="/doctor-access" element={<VerifyOtp />} />
        <Route path="/book-appointment/:id" element={<BookAppointment/>} />
        <Route path="/view-appointments" element={<Appointments/>} />
        <Route path="/book-appointment" element={<FindDoctors/>} />
        <Route path="/add-doctor" element={<AddDoctor/>} />
      </Routes>
    </Router>
  );
}

export default App;
