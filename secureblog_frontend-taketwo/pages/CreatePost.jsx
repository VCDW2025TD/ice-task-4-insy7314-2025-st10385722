// ...existing code...
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../src/services/api';

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm(prev => ({ ...prev, image: '' }));
      return;
    }
    try {
      const base64 = await toBase64(file);
      setForm(prev => ({ ...prev, image: base64 }));
    } catch (err) {
      setMessage('Failed to read image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.title || !form.content) {
      setMessage('Title and content required');
      return;
    }
    try {
      const res = await API.post('/posts', form);
      if (res.status === 201) {
        navigate('/post-list');
      } else {
        setMessage(res.data?.message || 'Failed to create');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', width: '100vw', boxSizing: 'border-box'
    }}>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 420 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} rows={8} required />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {form.image && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Preview:</div>
            <img src={form.image} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 6 }} />
            <div>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                style={{ marginTop: 8, padding: '6px 12px' }}
              >
                Remove image
              </button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={{ padding: '8px 20px' }}>Create</button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '8px 20px' }}>Cancel</button>
        </div>
      </form>
      <div style={{ color: 'red', marginTop: 12 }}>{message}</div>
    </div>
  );
}