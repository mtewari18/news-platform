import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const ArticleView = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    apiFetch(`/articles/${slug}`).then(setArticle).catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (article) {
      apiFetch(`/comments/${article._id}`).then(setComments).catch(console.error);
    }
  }, [article]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    await apiFetch(`/comments/${article._id}`, { method: 'POST', body: JSON.stringify({ content: newComment }) });
    setNewComment('');
    setComments(await apiFetch(`/comments/${article._id}`));
  };

  if (!article) return <div>Loading...</div>;
  return (
    <div>
      <h1>{article.title}</h1>
      <p><em>By {article.author?.name}</em></p>
      {article.image && <img src={`${(import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace('/api','')}${article.image}`} alt="" style={{ width:'100%', maxHeight:400, objectFit:'cover' }} />}
      <p>{article.content}</p>

      <h3>Comments</h3>
      {user ? (
        <form onSubmit={addComment}>
          <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} rows={4} />
          <button type="submit">Add Comment</button>
        </form>
      ) : <p><em>Login to post comments.</em></p>}
      <ul>
        {comments.map(c => (
          <li key={c._id}><strong>{c.author?.name}</strong>: {c.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleView;
