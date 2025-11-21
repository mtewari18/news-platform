import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ setUser }) => {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/auth/register`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || 'Register failed');
      localStorage.setItem('token', data.token);
      setUser(data.user);
      nav('/');
    } catch (e) {
      setErr(e.message || 'Error');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <div><label>Name</label><br/><input value={name} onChange={e=>setName(e.target.value)} /></div>
      <div><label>Email</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><label>Password</label><br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
