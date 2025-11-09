import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await AuthService.register(formData);
      setMessage("✅ Registration successful! Please verify OTP sent to your email.");
      setTimeout(() => navigate("/enter-otp", { state: { email: formData.email } }), 1300);
    } catch (error) {
      setMessage(
        error?.response?.data?.password ||
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.username?.[0] ||
        "❌ Registration failed."
      );
    }

    setLoading(false);
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const user = await AuthService.googleLogin({
        email: decoded.email,
        name: decoded.name,
      });

      if (!user.role) {
        navigate("/select-role");
      } else {
        navigate(`/${user.role}/dashboard`);
      }

    } catch (err) {
      setMessage("❌ Google login failed.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
    borderRadius: "clamp(10px, 2vw, 12px)",
    border: "2px solid #c8e6c9",
    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7)",
          padding: "clamp(1rem, 4vw, 2rem)",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "clamp(15px, 3vw, 20px)",
            maxWidth: 420,
            width: "100%",
            padding: "clamp(1.5rem, 6vw, 2.5rem)",
            boxShadow: "0 18px 45px rgba(46, 125, 50, 0.25)",
            border: "1px solid rgba(46, 125, 50, 0.2)",
            animation: "slideUp 0.6s ease-out",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(1.5rem, 6vw, 2rem)",
              marginBottom: "clamp(0.3rem, 1vw, 0.5rem)",
              color: "#1b5e20",
              fontWeight: 700,
              margin: "0 0 clamp(0.3rem, 1vw, 0.5rem) 0"
            }}
          >
            AgriBazaar
          </h2>

          <p style={{ 
            textAlign: "center", 
            color: "#558b2f", 
            marginBottom: "clamp(1.2rem, 4vw, 2rem)",
            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            margin: "clamp(0.3rem, 1vw, 0.5rem) 0 clamp(1.2rem, 4vw, 2rem) 0"
          }}>
            Create your account
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(0.8rem, 2vw, 1rem)" }}>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#388e3c";
                e.target.style.boxShadow = "0 0 0 3px rgba(56, 142, 60, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#c8e6c9";
                e.target.style.boxShadow = "none";
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#388e3c";
                e.target.style.boxShadow = "0 0 0 3px rgba(56, 142, 60, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#c8e6c9";
                e.target.style.boxShadow = "none";
              }}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#388e3c";
                  e.target.style.boxShadow = "0 0 0 3px rgba(56, 142, 60, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#c8e6c9";
                  e.target.style.boxShadow = "none";
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "clamp(10px, 2vw, 14px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  userSelect: "none",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showPass2 ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#388e3c";
                  e.target.style.boxShadow = "0 0 0 3px rgba(56, 142, 60, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#c8e6c9";
                  e.target.style.boxShadow = "none";
                }}
              />
              <span
                onClick={() => setShowPass2(!showPass2)}
                style={{
                  position: "absolute",
                  right: "clamp(10px, 2vw, 14px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  userSelect: "none",
                }}
              >
                {showPass2 ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              style={{
                background: buttonHover ? "#2e7d32" : "#388e3c",
                color: "white",
                padding: "clamp(10px, 2.5vw, 14px) clamp(1.5rem, 3vw, 1.8rem)",
                borderRadius: "clamp(10px, 2vw, 12px)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
                transition: "0.3s",
                marginTop: "clamp(0.2rem, 1vw, 0.4rem)",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                opacity: loading ? 0.7 : 1,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {loading ? "Creating account..." : "🌱 Register"}
            </button>
          </form>

          <div style={{ 
            textAlign: "center", 
            margin: "clamp(1rem, 3vw, 1.5rem) 0", 
            color: "#558b2f",
            fontSize: "clamp(0.85rem, 2vw, 0.95rem)"
          }}>
            or
          </div>

          {/* GOOGLE SIGNUP */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center",
            overflow: "auto"
          }}>
            <div style={{ 
              width: "100%",
              maxWidth: "330px",
              display: "flex",
              justifyContent: "center"
            }}>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => setMessage("❌ Google sign-in failed")}
                width="100%"
              />
            </div>
          </div>

          {message && (
            <p style={{ 
              textAlign: "center", 
              marginTop: "clamp(0.8rem, 2vw, 1rem)", 
              color: message.startsWith("✅") ? "#1b5e20" : "#c62828",
              fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
              wordBreak: "break-word"
            }}>
              {message}
            </p>
          )}

          <p style={{ 
            textAlign: "center", 
            marginTop: "clamp(1.2rem, 3vw, 1.5rem)",
            fontSize: "clamp(0.85rem, 2vw, 0.95rem)"
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{ 
              color: "#1b5e20", 
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.color = "#388e3c"}
            onMouseLeave={(e) => e.target.style.color = "#1b5e20"}
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

export default RegisterPage;