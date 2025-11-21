import React, { useState } from 'react';

const RequestReset = () => {
  const [email,setEmail]=useState('');
  const [msg,setMsg]=useState(null);

  const submit=async(e)=> {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/auth/request-reset`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email })
    });
    const data = await res.json();
    setMsg(data.message || 'If that email exists you will receive reset instructions');
  };

  return (
    <form onSubmit={submit}>
      <h2>Request Password Reset</h2>
      {msg && <p>{msg}</p>}
      <div><label>Email</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <button type="submit">Send reset email</button>
    </form>
  );
};

export default RequestReset;
