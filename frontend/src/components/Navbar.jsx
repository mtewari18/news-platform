import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #ddd', alignItems:'center' }}>
      <Link to="/">Home</Link>
      {user?.role === 'admin' && <Link to="/admin/dashboard">Admin Dashboard</Link>}
      {user && ['admin','editor'].includes(user.role) && <Link to="/create">Create</Link>}
      <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
