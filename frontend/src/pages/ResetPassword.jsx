import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/auth/reset/${token}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.message || 'Error');
    else { setMsg('Password reset'); setTimeout(()=>nav('/login'), 1500); }
  };

  return (
    <form onSubmit={submit}>
      <h2>Reset Password</h2>
      {msg && <p>{msg}</p>}
      <div><label>New Password</label><br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Reset</button>
    </form>
  );
};

export default ResetPassword;
