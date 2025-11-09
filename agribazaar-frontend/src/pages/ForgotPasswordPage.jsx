import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await AuthService.requestPasswordReset(email);
      setMsg("✅ If this email exists, reset link has been sent to your inbox.");
      setEmail("");
    } catch (error) {
      setMsg("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
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
    background: "linear-gradient(135deg, rgba(245, 245, 220, 0.98), rgba(200, 230, 201, 0.95))",
    borderRadius: "clamp(15px, 3vw, 20px)",
    maxWidth: "450px",
    width: "100%",
    padding: "clamp(1.5rem, 6vw, 3rem)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(46, 139, 87, 0.2)",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "clamp(0.3rem, 1vw, 0.5rem)",
    color: "#1b5e2f",
    fontSize: "clamp(1.8rem, 6vw, 2rem)",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: "0 0 clamp(0.3rem, 1vw, 0.5rem) 0",
  };

  const subtitleStyle = {
    textAlign: "center",
    marginBottom: "clamp(1.2rem, 4vw, 2rem)",
    color: "#5a7a6a",
    fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
    fontWeight: "400",
    lineHeight: "1.6",
    margin: "clamp(0.3rem, 1vw, 0.5rem) 0 clamp(1.2rem, 4vw, 2rem) 0",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(1rem, 2vw, 1.2rem)",
  };

  const inputStyle = {
    padding: "clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px)",
    borderRadius: "clamp(10px, 2vw, 12px)",
    border: "2px solid #2d8e4a",
    width: "100%",
    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#1b5e2f",
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#1b5e2f",
    boxShadow: "0 0 0 3px rgba(27, 94, 47, 0.1)",
    background: "white",
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
    transform: loading ? "none" : "translateY(-2px)",
    boxShadow: loading ? "0 4px 15px rgba(45, 142, 74, 0.2)" : "0 6px 20px rgba(45, 142, 74, 0.3)",
  };

  const msgStyle = {
    marginTop: "clamp(1rem, 2vw, 1.2rem)",
    padding: "clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px)",
    borderRadius: "clamp(8px, 1.5vw, 10px)",
    fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
    fontWeight: "500",
    textAlign: "center",
    background: msg.includes("❌") ? "rgba(229, 57, 53, 0.15)" : "rgba(56, 142, 60, 0.15)",
    color: msg.includes("❌") ? "#c62828" : "#2e7d32",
    border: msg.includes("❌") ? "1.5px solid rgba(229, 57, 53, 0.3)" : "1.5px solid rgba(56, 142, 60, 0.3)",
    animation: "slideIn 0.3s ease",
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: "clamp(1.2rem, 3vw, 1.5rem)",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#5a7a6a",
  };

  const linkAnchorStyle = {
    color: "#1b5e2f",
    fontWeight: "700",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.3s ease",
  };

  return (
    <>
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

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>🔐 Reset Password</h2>
          <p style={subtitleStyle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div style={formStyle}>
            <input
              type="email"
              placeholder="📧 Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              {loading ? "⏳ Sending..." : "📧 Send Reset Link"}
            </button>
          </div>

          {msg && <p style={msgStyle}>{msg}</p>}

          <div style={linkStyle}>
            Remember your password?
            <span
              style={linkAnchorStyle}
              onClick={() => handleNavigate("/login")}
              onMouseEnter={(e) => (e.target.style.color = "#0d3b1a")}
              onMouseLeave={(e) => (e.target.style.color = "#1b5e2f")}
            >
              {" "}Login
            </span>
          </div>

          <div style={linkStyle}>
            Don't have an account?
            <span
              style={linkAnchorStyle}
              onClick={() => handleNavigate("/register")}
              onMouseEnter={(e) => (e.target.style.color = "#0d3b1a")}
              onMouseLeave={(e) => (e.target.style.color = "#1b5e2f")}
            >
              {" "}Register
            </span>
          </div>
        </div>
      </div>
    </>
  );
}