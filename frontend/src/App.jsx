import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArticleView from './pages/ArticleView';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateArticle from './pages/CreateArticle';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import RequestReset from './pages/RequestReset';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdSlot from './components/AdSlot';

const App = () => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <AdSlot position="top" />
      <main style={{ display:'flex', gap:20, padding:'1rem', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ flex:1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleView />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/request-reset" element={<RequestReset />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/create" element={
              <ProtectedRoute user={user} roles={['admin','editor']}>
                <CreateArticle user={user} />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute user={user} roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <aside style={{ width:300 }}>
          <AdSlot position="sidebar" />
        </aside>
      </main>
    </>
  );
};

export default App;
