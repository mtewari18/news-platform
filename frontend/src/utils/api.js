const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const apiFetch = async (path, opts = {}) => {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  if (!(opts.body instanceof FormData)) headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  } catch (err) {
    throw err;
  }
};
export default apiFetch;
