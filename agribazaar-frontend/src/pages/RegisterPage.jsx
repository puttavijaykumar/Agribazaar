import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      await AuthService.register(formData);
      setMessage("✅ Registration successful! You can now login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage(
        error?.response?.data?.password ||
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.username?.[0] ||
        "❌ Registration failed."
      );
    }

    setSubmitting(false);
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const userInfo = jwtDecode(credentialResponse.credential);
      await AuthService.registerGoogle(userInfo);
      setMessage("✅ Signed up with Google!");
      setTimeout(() => navigate("/"), 800);
    } catch {
      setMessage("❌ Google signup failed");
    }
  };

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

  const bgDecorationStyle = {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.1,
    pointerEvents: "none",
  };

  const cardStyle = {
    background: "linear-gradient(180deg, #ffffff 0%, #f1f8f6 100%)",
    borderRadius: 20,
    width: "100%",
    maxWidth: 420,
    padding: "2.5rem",
    boxShadow: "0 20px 60px rgba(0, 100, 0, 0.15)",
    border: "1px solid rgba(76, 175, 80, 0.2)",
    position: "relative",
    zIndex: 10,
    animation: "slideUp 0.6s ease-out",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem",
  };

  const logoStyle = {
    fontSize: "3rem",
    marginBottom: "0.5rem",
  };

  const titleStyle = {
    color: "#1b5e20",
    marginBottom: "0.5rem",
    fontSize: "1.95rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  };

  const subtitleStyle = {
    color: "#558b2f",
    fontSize: "0.95rem",
    fontWeight: 400,
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 14,
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

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#4caf50",
    backgroundColor: "#ffffff",
    boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
    outline: "none",
  };

  const passwordContainerStyle = {
    position: "relative",
  };

  const eyeStyle = {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1.2rem",
    userSelect: "none",
    transition: "transform 0.2s ease",
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

  const dividerStyle = {
    textAlign: "center",
    margin: "18px 0",
    color: "#558b2f",
    fontSize: "0.9rem",
    fontWeight: 500,
    position: "relative",
  };

  const dividerLineStyle = {
    content: '""',
    position: "absolute",
    top: "50%",
    width: "100%",
    height: "1px",
    backgroundColor: "#c8e6c9",
    zIndex: 0,
  };

  const dividerTextStyle = {
    position: "relative",
    display: "inline-block",
    backgroundColor: "#f1f8f6",
    padding: "0 8px",
    zIndex: 1,
  };

  const messageStyle = {
    marginTop: 16,
    textAlign: "center",
    color: message.startsWith("✅") ? "#1b5e20" : "#c62828",
    fontSize: "0.95rem",
    fontWeight: 500,
    animation: "fadeIn 0.4s ease",
  };

  const loginLinkStyle = {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#558b2f",
    fontSize: "0.95rem",
  };

  const linkStyle = {
    color: "#2e7d32",
    fontWeight: 700,
    textDecoration: "none",
    transition: "all 0.3s ease",
    borderBottom: "2px solid transparent",
  };

  const [buttonHover, setButtonHover] = useState(false);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={containerStyle}>
        {/* Background Decorations */}
        <div
          style={{
            ...bgDecorationStyle,
            width: 300,
            height: 300,
            background: "#81c784",
            top: -100,
            left: -100,
          }}
        />
        <div
          style={{
            ...bgDecorationStyle,
            width: 250,
            height: 250,
            background: "#a5d6a7",
            bottom: -80,
            right: -50,
          }}
        />
        <div
          style={{
            ...bgDecorationStyle,
            width: 200,
            height: 200,
            background: "#81c784",
            top: "50%",
            right: "5%",
          }}
        />

        {/* Main Card */}
        <div style={cardStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={logoStyle}></div>
            <h2 style={titleStyle}>AgriBazaar</h2>
            <p style={subtitleStyle}>Join our farming community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
              onBlur={(e) => (e.target.style.borderColor = "#e0f2e9")}
              required
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
              onBlur={(e) => (e.target.style.borderColor = "#e0f2e9")}
              required
              style={inputStyle}
            />

            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
                onBlur={(e) => (e.target.style.borderColor = "#e0f2e9")}
                required
                style={inputStyle}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={eyeStyle}
                onMouseEnter={(e) => (e.target.style.transform = "translateY(-50%) scale(1.2)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateY(-50%) scale(1)")}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <div style={passwordContainerStyle}>
              <input
                type={showPass2 ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
                onBlur={(e) => (e.target.style.borderColor = "#e0f2e9")}
                required
                style={inputStyle}
              />
              <span
                onClick={() => setShowPass2(!showPass2)}
                style={eyeStyle}
                onMouseEnter={(e) => (e.target.style.transform = "translateY(-50%) scale(1.2)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateY(-50%) scale(1)")}
              >
                {showPass2 ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={buttonHover && !loading ? buttonHoverStyle : buttonStyle}
              onMouseEnter={() => !loading && setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              onMouseDown={(e) => {
                e.target.style.transform = "translateY(0px)";
              }}
              onMouseUp={(e) => {
                e.target.style.transform = buttonHover ? "translateY(-2px)" : "translateY(0)";
              }}
            >
              {loading ? "Creating account..." : "🌱 Register"}
            </button>
          </form>

          {/* Divider */}
          <div style={dividerStyle}>
            <div style={dividerLineStyle}></div>
            <span style={dividerTextStyle}>or</span>
          </div>

          {/* Google Login */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => setMessage("❌ Google failed")}
              width="330"
            />
          </div>

          {/* Message */}
          {message && <p style={messageStyle}>{message}</p>}

          {/* Login Link */}
          <p style={loginLinkStyle}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.target.style.borderBottomColor = "#2e7d32";
                e.target.style.color = "#1b5e20";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottomColor = "transparent";
                e.target.style.color = "#2e7d32";
              }}
            >
              Login
            </Link>
          </p>
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          input::placeholder {
            color: #a1d9a1;
          }

          input:focus {
            outline: none;
          }

          button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          @media (max-width: 480px) {
            ${cardStyle} {
              padding: 1.5rem;
              max-width: 90%;
            }
          }
        `}</style>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;