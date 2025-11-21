import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const CreateArticle = () => {
  const [title,setTitle]=useState('');
  const [summary,setSummary]=useState('');
  const [content,setContent]=useState('');
  const [tags,setTags]=useState('');
  const [imageFile,setImageFile]=useState(null);
  const [categories,setCategories]=useState([]);
  const [category,setCategory]=useState('');
  const [err,setErr]=useState(null);
  const nav = useNavigate();

  useEffect(()=>{ apiFetch('/categories').then(setCategories).catch(console.error); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('content', content);
      formData.append('tags', tags);
      formData.append('category', category);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/articles`, {
        method:'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || 'Error');
      nav(`/article/${data.slug}`);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Submit Article</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <div><label>Title</label><br/><input value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div><label>Summary</label><br/><input value={summary} onChange={e=>setSummary(e.target.value)} /></div>
      <div><label>Category</label><br/>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">-- choose --</option>
          {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div><label>Content</label><br/><textarea value={content} rows={12} onChange={e=>setContent(e.target.value)} /></div>
      <div><label>Tags (comma separated)</label><br/><input value={tags} onChange={e=>setTags(e.target.value)} /></div>
      <div><label>Image</label><br/><input type="file" onChange={e=>setImageFile(e.target.files[0])} /></div>
      <button type="submit">Submit (pending approval)</button>
    </form>
  );
};

export default CreateArticle;
