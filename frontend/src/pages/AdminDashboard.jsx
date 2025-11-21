import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  useEffect(()=>{ apiFetch('/admin/stats').then(setStats).catch(console.error); }, []);
  if (!stats) return <div>Loading...</div>;

  const data = { labels:['Total','Approved','Pending','Users'], datasets:[{ label:'Counts', data:[stats.totalArticles, stats.approved, stats.pending, stats.usersCount] }] };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{display:'flex', gap:12}}>
        <div style={{padding:12, border:'1px solid #ddd'}}><h3>Total</h3><p>{stats.totalArticles}</p></div>
        <div style={{padding:12, border:'1px solid #ddd'}}><h3>Approved</h3><p>{stats.approved}</p></div>
        <div style={{padding:12, border:'1px solid #ddd'}}><h3>Pending</h3><p>{stats.pending}</p></div>
        <div style={{padding:12, border:'1px solid #ddd'}}><h3>Users</h3><p>{stats.usersCount}</p></div>
      </div>
      <div style={{maxWidth:600, marginTop:20}}><Bar data={data} /></div>

      <h2>Recent Articles</h2>
      <ul>
        {stats.recentArticles.map(a=> <li key={a._id}>{a.title} — {a.author?.name} • {new Date(a.createdAt).toLocaleString()}</li>)}
      </ul>
    </div>
  );
};

export default AdminDashboard;
