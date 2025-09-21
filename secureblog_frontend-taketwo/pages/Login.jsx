import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail, isStrongPassword } from "../src/utils/validators";
import API from "../src/services/api";

export default function Login({ onLoginSuccess = () => {} }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Invalid email format.");
      return;
    }
    if (!isStrongPassword(form.password)) {
      setError("Password must be at least 8 characters and include letters and numbers.");
      return;
    }

    // Submit login request
    try {
      const res = await API.post("/auth/login", form);
      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        if(typeof onLoginSuccess === 'function') onLoginSuccess();
        navigate("/dashboard");
        window.location.reload();
      } else {
        setMessage(res.data.message || "Login failed.");
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || "Error connecting to server.");
    }
  };

  return (
    <div
      className="login-container"
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
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", width: "300px" }}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>{message}</div>
      <div style={{ color: "red" }}>{error}</div>
    </div>
  );
}