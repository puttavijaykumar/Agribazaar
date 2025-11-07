import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com"; // ✅ Your Google OAuth Client ID

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
      const user = await AuthService.login(loginData); 

      setMsg("✅ Logged in successfully!");

      setTimeout(() => {
        if (!user.role || user.role === "" || user.role === null) {
          navigate("/select-role");
        } else {
          navigate(`/${user.role}/dashboard`);
        }
      }, 700);

    } catch {
      setMsg("❌ Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  // ✅ Google Login Handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const user = await AuthService.googleLogin({
        email: decoded.email,
        name: decoded.name,
      });

      // ✅ Redirect based on role
      if (!user.role || user.role === "" || user.role === null) {
        navigate("/select-role");
      } else {
        navigate(`/${user.role}/dashboard`);
      }

    } catch (err) {
      setMsg("❌ Google login failed.");
    }
  };

  // UI styles (no changes)
  const containerStyle = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7)", fontFamily: "Segoe UI", padding: "20px" };
  const cardStyle = { background: "#fff", borderRadius: 20, maxWidth: 400, width: "100%", padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,100,0,0.15)" };
  const inputStyle = { padding: "12px 16px", borderRadius: 12, border: "2px solid #c8e6c9", width: "100%" };
  const buttonStyle = { background: "#388e3c", color: "white", padding: "14px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700 };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={containerStyle}>
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

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Logging in..." : "🔓 Login"}
            </button>
          </form>

          {/* ✅ Google Login Button */}
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMsg("❌ Google sign-in failed")}
            />
          </div>

          {msg && <p style={{ marginTop: 12, textAlign: "center" }}>{msg}</p>}

          <p style={{ textAlign: "center", marginTop: 16 }}>
            Don't have an account?
            <Link to="/register" style={{ color: "#1b5e20", fontWeight: "700", marginLeft: 6 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
