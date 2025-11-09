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
    padding: "clamp(1rem, 4vw, 2rem)",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "clamp(15px, 3vw, 20px)",
    maxWidth: "420px",
    width: "100%",
    padding: "clamp(1.5rem, 6vw, 3rem)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "clamp(0.3rem, 1vw, 0.5rem)",
    color: "#1b5e2f",
    fontSize: "clamp(1.5rem, 6vw, 1.75rem)",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: "0 0 clamp(0.3rem, 1vw, 0.5rem) 0"
  };

  const subtitleStyle = {
    textAlign: "center",
    marginBottom: "clamp(1.2rem, 4vw, 2rem)",
    color: "#7a8fa6",
    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
    fontWeight: "400",
    margin: "clamp(0.3rem, 1vw, 0.5rem) 0 clamp(1.2rem, 4vw, 2rem) 0"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(1rem, 2vw, 1.2rem)",
  };

  const inputStyle = {
    padding: "clamp(10px, 2.5vw, 13px) clamp(12px, 3vw, 16px)",
    borderRadius: "clamp(10px, 2vw, 12px)",
    border: "2px solid #e0e7f1",
    width: "100%",
    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
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
    right: "clamp(10px, 2vw, 14px)",
    cursor: "pointer",
    fontSize: "clamp(1rem, 2vw, 1.1rem)",
    userSelect: "none",
    transition: "opacity 0.2s ease",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #2d8e4a, #1b5e2f)",
    color: "white",
    padding: "clamp(10px, 2.5vw, 14px) clamp(1.5rem, 3vw, 1.8rem)",
    borderRadius: "clamp(10px, 2vw, 12px)",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "700",
    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
    transition: "all 0.3s ease",
    opacity: loading ? 0.8 : 1,
    boxShadow: "0 4px 15px rgba(45, 142, 74, 0.2)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(45, 142, 74, 0.3)",
  };

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "clamp(1.5rem, 3vw, 2rem)",
    marginBottom: "clamp(1.2rem, 3vw, 1.5rem)",
    gap: "clamp(0.8rem, 2vw, 1rem)",
  };

  const lineStyle = {
    flex: 1,
    height: "1px",
    background: "#e0e7f1",
  };

  const dividerTextStyle = {
    color: "#a0b0c0",
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    fontWeight: "500",
    whiteSpace: "nowrap",
  };

  const googleButtonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "clamp(1.2rem, 3vw, 1.5rem)",
    width: "100%",
  };

  const linkContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "clamp(1rem, 2vw, 1.3rem)",
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
  };

  const linkStyle = {
    color: "#2d8e4a",
    fontWeight: "600",
    textDecoration: "none",
    transition: "all 0.2s ease",
  };

  const signupContainerStyle = {
    textAlign: "center",
    marginTop: "clamp(1.5rem, 3vw, 1.8rem)",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#6a7a8a",
  };

  const msgStyle = {
    marginTop: "clamp(1rem, 2vw, 1.2rem)",
    textAlign: "center",
    padding: "clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2vw, 1.2rem)",
    borderRadius: "clamp(6px, 1.5vw, 8px)",
    fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
    fontWeight: "500",
    background: msg.includes("❌") ? "rgba(229, 57, 53, 0.1)" : "rgba(56, 142, 60, 0.1)",
    color: msg.includes("❌") ? "#c62828" : "#2e7d32",
    border: msg.includes("❌") ? "1px solid rgba(229, 57, 53, 0.2)" : "1px solid rgba(56, 142, 60, 0.2)",
    animation: "slideIn 0.3s ease",
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
            <Link 
              to="/forgot-password" 
              style={linkStyle}
              onMouseEnter={(e) => e.target.style.color = "#1a3a52"} 
              onMouseLeave={(e) => e.target.style.color = "#2d8e4a"}
            >
              🔑 Forgot Password?
            </Link>
          </div>

          <div style={dividerStyle}>
            <div style={lineStyle}></div>
            <span style={dividerTextStyle}>or continue with</span>
            <div style={lineStyle}></div>
          </div>

          <div style={googleButtonContainerStyle}>
            <div style={{ width: "100%", maxWidth: "330px", display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setMsg("❌ Google sign-in failed")}
                width="100%"
              />
            </div>
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

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Phones (320px - 480px) */
        @media (max-width: 480px) {
          input::placeholder {
            font-size: 0.8rem;
          }
          input, button {
            font-size: 16px !important;
          }
        }

        /* Small Tablets (481px - 600px) */
        @media (max-width: 600px) {
          input, button, textarea {
            font-size: 16px !important;
          }
        }

        /* Medium Tablets (601px - 900px) */
        @media (min-width: 601px) and (max-width: 900px) {
          /* Smooth transitions for tablet */
        }

        /* Large Screens (901px+) */
        @media (min-width: 901px) {
          button {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;