import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    apiFetch('/articles').then(setArticles).catch(console.error);
  }, []);
  return (
    <div>
      <h1>Latest News</h1>
      {articles.length === 0 && <p>No articles yet.</p>}
      <ul>
        {articles.map(a => (
          <li key={a._id} style={{ marginBottom: 12 }}>
            <h3><Link to={`/article/${a.slug}`}>{a.title}</Link></h3>
            {a.image && <img src={`${(import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace('/api','')}${a.image}`} alt="" style={{maxWidth:300}} />}
            <p>{a.summary}</p>
            <small>By {a.author?.name} • {new Date(a.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
