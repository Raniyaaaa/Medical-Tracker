import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">MedTrack</Link>
      <div className="ml-auto">
        <Link className="btn btn-light mx-1" to="/add-record">Add Record</Link>
        <Link className="btn btn-light mx-1" to="/add-reminder">Add Reminder</Link>
        <Link className="btn btn-light mx-1" to="/share-access">Share Access</Link>
        <button onClick={logout} className="btn btn-danger mx-1">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
