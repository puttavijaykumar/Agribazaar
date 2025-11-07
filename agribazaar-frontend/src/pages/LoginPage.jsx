import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const user = await AuthService.googleLogin({
        email: decoded.email,
        name: decoded.name,
      });

      if (!user.role || user.role === "" || user.role === null) {
        navigate("/select-role");
      } else {
        navigate(`/${user.role}/dashboard`);
      }

    } catch (err) {
      setMsg("❌ Google login failed.");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0d3b1a, #1b5e2f, #2d8e4a, #3fac5d)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    maxWidth: "420px",
    width: "100%",
    padding: "3rem",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "0.5rem",
    color: "#1b5e2f",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  };

  const subtitleStyle = {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#7a8fa6",
    fontSize: "14px",
    fontWeight: "400",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const inputStyle = {
    padding: "13px 16px",
    borderRadius: "12px",
    border: "2px solid #e0e7f1",
    width: "100%",
    fontSize: "15px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none",
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#2c5364",
    boxShadow: "0 0 0 3px rgba(44, 83, 100, 0.1)",
  };

  const passwordContainerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const eyeIconStyle = {
    position: "absolute",
    right: "14px",
    cursor: "pointer",
    fontSize: "18px",
    userSelect: "none",
    transition: "opacity 0.2s ease",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #2d8e4a, #1b5e2f)",
    color: "white",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "700",
    fontSize: "16px",
    transition: "all 0.3s ease",
    opacity: loading ? 0.8 : 1,
    boxShadow: "0 4px 15px rgba(45, 142, 74, 0.2)",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(45, 142, 74, 0.3)",
  };

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "24px",
    marginBottom: "20px",
    gap: "12px",
  };

  const lineStyle = {
    flex: 1,
    height: "1px",
    background: "#e0e7f1",
  };

  const dividerTextStyle = {
    color: "#a0b0c0",
    fontSize: "13px",
    fontWeight: "500",
  };

  const googleButtonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  };

  const linkContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "18px",
    fontSize: "13px",
  };

  const linkStyle = {
    color: "#2d8e4a",
    fontWeight: "600",
    textDecoration: "none",
    transition: "all 0.2s ease",
  };

  const signupContainerStyle = {
    textAlign: "center",
    marginTop: "22px",
    fontSize: "14px",
    color: "#6a7a8a",
  };

  const msgStyle = {
    marginTop: "16px",
    textAlign: "center",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    background: msg.includes("❌") ? "rgba(229, 57, 53, 0.1)" : "rgba(56, 142, 60, 0.1)",
    color: msg.includes("❌") ? "#c62828" : "#2e7d32",
    border: msg.includes("❌") ? "1px solid rgba(229, 57, 53, 0.2)" : "1px solid rgba(56, 142, 60, 0.2)",
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>👋 Welcome Back</h2>
          <p style={subtitleStyle}>Sign in to your account</p>

          <form onSubmit={handleLogin} style={formStyle}>
            <input
              type="email"
              name="email"
              placeholder="📧 Email address"
              value={loginData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />

            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="🔒 Password"
                value={loginData.password}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={eyeIconStyle}
                onMouseEnter={(e) => e.target.style.opacity = "0.7"}
                onMouseLeave={(e) => e.target.style.opacity = "1"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              {loading ? "⏳ Logging in..." : "🔓 Login"}
            </button>
          </form>

          <div style={linkContainerStyle}>
            <Link to="/forgot-password" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#1a3a52"} onMouseLeave={(e) => e.target.style.color = "#2c5364"}>
              🔑 Forgot Password?
            </Link>
          </div>

          <div style={dividerStyle}>
            <div style={lineStyle}></div>
            <span style={dividerTextStyle}>or continue with</span>
            <div style={lineStyle}></div>
          </div>

          <div style={googleButtonContainerStyle}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMsg("❌ Google sign-in failed")}
            />
          </div>

          {msg && <p style={msgStyle}>{msg}</p>}

          <div style={signupContainerStyle}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ ...linkStyle, marginLeft: "4px", fontWeight: "700", color: "#2c5364" }}
              onMouseEnter={(e) => e.target.style.color = "#1a3a52"}
              onMouseLeave={(e) => e.target.style.color = "#2c5364"}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;