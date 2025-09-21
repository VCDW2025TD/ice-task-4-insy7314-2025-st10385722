import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import AuthLanding from '../pages/AuthLanding';
import CreatePost from '../pages/CreatePost';
import PostList from '../pages/PostList';
import EditPost from '../pages/EditPost';

//security demo
import SecurityDemo from '../pages/SecurityDemo';

const isLoggedIn = () => !!localStorage.getItem("token");

function Home() {
  const navigate = useNavigate();
  return (
    <div
      className="home-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box"
      }}
    >
      <h2>Welcome to Secure Blog</h2>
      <p style={{ marginBottom: "30px" }}>Your place for secure blogging.</p>
      <div style={{ display: "flex", gap: "20px" }}>
        <button
          style={{
            padding: "12px 32px",
            fontSize: "1.1rem",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          style={{
            padding: "12px 32px",
            fontSize: "1.1rem",
            background: "#43a047",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

function App() {
  const [testMsg, setTestMsg] = useState('');

  useEffect(() => {
    axios.get('https://localhost:5000/test')
      .then(res => setTestMsg(res.data.message))
      .catch(err => console.error(err));
  }, []);
  
    return (
      <Router>
        <nav style={{ padding: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
          {!isLoggedIn() && <Link to="/">Home</Link>}
          {isLoggedIn() ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/logout">
                <button style={{
                  padding: "8px 20px",
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginLeft: "8px"
                }}>
                  Logout
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/auth-landing" element={<AuthLanding />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post-list" element={<PostList />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/security-demo" element={<SecurityDemo />} />
        </Routes>
      </Router>
    );  
}
export default App;