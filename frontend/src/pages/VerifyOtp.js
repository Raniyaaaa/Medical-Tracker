import React, { useState } from 'react';
import API from '../services/api';

function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [records, setRecords] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/share/verify-otp', { doctorEmail: email, otp });
      setRecords(res.data.records);
      setPatientName(res.data.patient);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to verify OTP');
    }
  };

  const downloadPdf = () => {
      API.get('/pdf/download', { responseType: 'blob' }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'medtrack-records.pdf');
        document.body.appendChild(link);
        link.click();
      });
};

  return (
    <div className="container mt-5">
      <h3>Doctor Access - Enter OTP</h3>
      <form onSubmit={submit} className="mb-3">
        <input className="form-control my-2" placeholder="Your Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input className="form-control my-2" placeholder="Enter OTP" value={otp}
          onChange={e => setOtp(e.target.value)} required />
        <button className="btn btn-primary">Verify OTP</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {records && (
        <div>
          <h4>Records for {patientName}</h4>
          <button onClick={downloadPdf} className="btn btn-outline-primary my-2">📄 Download PDF</button>
          {records.map(rec => (
            <div key={rec._id} className="card my-2">
              <div className="card-body">
                <h5>{rec.title} ({rec.type})</h5>
                <p>{rec.notes}</p>
                <small>{new Date(rec.date).toLocaleDateString()}</small><br />
                {rec.fileUrl && <a href={rec.fileUrl} target="_blank" rel="noreferrer">View File</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VerifyOtp;
