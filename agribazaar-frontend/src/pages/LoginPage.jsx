import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  const handleChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const user = await AuthService.login(loginData); // user is stored in localStorage

      setMsg("✅ Logged in successfully!");

      // ✅ Redirect based on whether role is set or not
      setTimeout(() => {
        if (!user.role || user.role === "" || user.role === null) {
          navigate("/select-role"); // ask role
        } else {
          navigate(`/${user.role}/dashboard`); // direct to respective dashboard
        }
      }, 700);

    } catch {
      setMsg("❌ Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  // ---- STYLING BELOW (unchanged) ----

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
    position: "relative",
    overflow: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  };

  const bgDecorationStyle = { position: "absolute", borderRadius: "50%", opacity: 0.1, pointerEvents: "none" };

  const cardStyle = {
    background: "linear-gradient(180deg, #ffffff 0%, #f1f8f6 100%)",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    padding: "2.5rem",
    boxShadow: "0 20px 60px rgba(0, 100, 0, 0.15)",
    border: "1px solid rgba(76, 175, 80, 0.2)",
    position: "relative",
    zIndex: 10,
    animation: "slideUp 0.6s ease-out",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%)",
    color: "#ffffff",
    padding: "14px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(46, 125, 50, 0.3)",
    transform: "translateY(0)",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    transform: "translateY(-2px)",
    boxShadow: "0 12px 28px rgba(46, 125, 50, 0.4)",
  };

  const inputStyle = {
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #e0f2e9",
    width: "100%",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    backgroundColor: "#f8fdf7",
    color: "#1b5e20",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      {/* Card */}
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#1b5e20" }}>Welcome Back</h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={loginData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonHover ? buttonHoverStyle : buttonStyle}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            {loading ? "Logging in..." : "🔓 Login"}
          </button>
        </form>

        {msg && <p style={{ marginTop: 12, textAlign: "center" }}>{msg}</p>}

        <p style={{ textAlign: "center", marginTop: 16 }}>
          Don't have an account?
          <Link to="/register" style={{ color: "#2e7d32", fontWeight: "700", marginLeft: 6 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
