import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import AddReminder from './pages/AddReminder';
import ShareAccess from './pages/ShareAccess';
import VerifyOtp from './pages/VerifyOtp';

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
      </Routes>
    </Router>
  );
}

export default App;
