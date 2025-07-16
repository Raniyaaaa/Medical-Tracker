import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Register(){
  const [form, setForm] =useState({name: '', email: '', password: ''});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" type="text" placeholder="Name"
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value})}/>
        <input className="form-control my-2" type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value})}/>
        <input className="form-control my-2" type="password" placeholder="Password"
           value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value})}/>
        <button className="btn btn-primary">Register</button>
      </form>

      <div className="mt-3 text-center">
        <span>Already have an account? </span>
        <button className="btn btn-link p-0" onClick={() => navigate('/')}>
          login
        </button>
      </div>
    </div>
  );
}

export default Register;
