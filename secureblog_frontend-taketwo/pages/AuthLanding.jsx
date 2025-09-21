import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const isLoggedIn = () => !!localStorage.getItem("token");

export default function AuthLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div
      className="auth-landing-container"
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