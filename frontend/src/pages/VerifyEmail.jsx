import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const [msg, setMsg] = useState('Verifying...');
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/auth/verify/${token}`)
      .then(r=>r.json()).then(d=>{ if(d.message) setMsg(d.message); else setMsg('Verified'); }).catch(e=>setMsg('Error'));
  }, [token]);
  return <div><h2>{msg}</h2></div>;
};

export default VerifyEmail;
