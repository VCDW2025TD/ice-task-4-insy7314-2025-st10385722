import { useEffect, useState } from 'react';
import API from '../src/services/api';
import { useNavigate, Link } from 'react-router-dom';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || null;
  } catch {
    return null;
  }
};

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  const load = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data || []);
    } catch (err) {
      setMsg('Failed to load posts');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      minHeight: '100vh', paddingTop: 40, boxSizing: 'border-box'
    }}>
      <h2>Posts</h2>
      <div style={{ width: '800px', maxWidth: '95%' }}>
        {posts.length === 0 && <div>No posts</div>}
        {posts.map((p) => (
          <div key={p._id} style={{ border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 8 }}>
            <h3>{p.title}</h3>
            <p>{p.content}</p>
            {p.image && <img src={p.image} alt="" style={{ maxWidth: '100%', marginTop: 8 }} />}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Author: {p.author?.email || p.author}</div>
              {userId && p.author && (p.author._id ? p.author._id === userId : p.author === userId) && (
                <>
                  <Link to={`/edit-post/${p._id}`}><button>Edit</button></Link>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: 'red', marginTop: 12 }}>{msg}</div>
    </div>
  );
}