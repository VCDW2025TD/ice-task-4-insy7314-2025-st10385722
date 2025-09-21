import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div
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
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Link to="/create-post">
          <button style={{
            padding: "12px 32px",
            fontSize: "1.1rem",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            Create Post
          </button>
        </Link>
        <Link to="/post-list">
          <button style={{
            padding: "12px 32px",
            fontSize: "1.1rem",
            background: "#43a047",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            View Posts
          </button>
        </Link>
      </div>
    </div>
  );
}