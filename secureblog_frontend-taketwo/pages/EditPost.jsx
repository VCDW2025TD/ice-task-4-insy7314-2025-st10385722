import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../src/services/api";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id || null;
  } catch {
    return null;
  }
};

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = getUserIdFromToken();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        if (!mounted) return;
        const post = res.data;
        setForm({ title: post.title || "", content: post.content || "", image: post.image || "" });
        // optional ownership check: if not owner, redirect
        if (post.author && (post.author._id || post.author) !== userId) {
          setMessage("You do not own this post.");
          // small delay so user sees message, then navigate away
          setTimeout(() => navigate("/post-list"), 1200);
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id, navigate, userId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.title || !form.content) {
      setMessage("Title and content are required.");
      return;
    }
    try {
      const res = await API.patch(`/posts/${id}`, form);
      if (res.status === 200) {
        navigate("/post-list");
      } else {
        setMessage(res.data?.message || "Update failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", width: "100vw", boxSizing: "border-box"
    }}>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, width: 420 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} rows={8} required />
        <input name="image" placeholder="Image URL or base64 string" value={form.image} onChange={handleChange} />
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" style={{ padding: "8px 20px" }}>Save</button>
          <button type="button" onClick={() => navigate("/post-list")} style={{ padding: "8px 20px" }}>Cancel</button>
        </div>
      </form>
      <div style={{ color: "red", marginTop: 12 }}>{message}</div>
    </div>
  );
}