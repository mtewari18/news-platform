import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      setUser(data.user);
      nav('/');
    } catch (e) {
      setErr(e.message || 'Error');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <div><label>Email</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><label>Password</label><br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
