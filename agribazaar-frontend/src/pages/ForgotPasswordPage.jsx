import React, { useState } from "react";
import AuthService from "../services/AuthService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // Simulate API call - replace with actual AuthService in your implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMsg("✅ If this email exists, reset link has been sent to your inbox.");
      setEmail("");
    } catch (error) {
      setMsg("❌ Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleNavigate = (path) => {
    // In production, use React Router or your navigation method
    console.log("Navigate to:", path);
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
    background: "linear-gradient(135deg, rgba(245, 245, 220, 0.98), rgba(200, 230, 201, 0.95))",
    borderRadius: "20px",
    maxWidth: "450px",
    width: "100%",
    padding: "3rem",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(46, 139, 87, 0.2)",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "0.5rem",
    color: "#1b5e2f",
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  };

  const subtitleStyle = {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#5a7a6a",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "1.6",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };

  const inputStyle = {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #2d8e4a",
    width: "100%",
    fontSize: "15px",
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
    boxShadow: "0 0 0 4px rgba(45, 142, 74, 0.15)",
    background: "rgba(255, 255, 255, 1)",
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

  const msgStyle = {
    marginTop: "18px",
    padding: "14px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    background: msg.includes("❌") 
      ? "rgba(229, 57, 53, 0.15)" 
      : "rgba(56, 142, 60, 0.15)",
    color: msg.includes("❌") 
      ? "#c62828" 
      : "#2e7d32",
    border: msg.includes("❌") 
      ? "1.5px solid rgba(229, 57, 53, 0.3)" 
      : "1.5px solid rgba(56, 142, 60, 0.3)",
    animation: "slideIn 0.3s ease",
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: "22px",
    fontSize: "14px",
    color: "#5a7a6a",
  };

  const linkAnchorStyle = {
    color: "#1b5e2f",
    fontWeight: "700",
    textDecoration: "none",
    transition: "all 0.2s ease",
    marginLeft: "4px",
    cursor: "pointer",
    display: "inline-block",
  };

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
    gap: "12px",
  };

  const lineStyle = {
    flex: 1,
    height: "1px",
    background: "rgba(45, 142, 74, 0.2)",
  };

  const dividerTextStyle = {
    color: "#5a7a6a",
    fontSize: "13px",
    fontWeight: "500",
  };

  const infoBoxStyle = {
    background: "rgba(45, 142, 74, 0.1)",
    border: "1px solid rgba(45, 142, 74, 0.2)",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
    fontSize: "13px",
    color: "#3a7548",
    textAlign: "center",
    lineHeight: "1.5",
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
      `}</style>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>🔐 Reset Password</h2>
          <p style={subtitleStyle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div style={infoBoxStyle}>
            ℹ️ Check your email (including spam folder) for the reset link
          </div>

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

          <div style={dividerStyle}>
            <div style={lineStyle}></div>
            <span style={dividerTextStyle}>or</span>
            <div style={lineStyle}></div>
          </div>

          <div style={linkStyle}>
            Remember your password?{" "}
            <span
              style={linkAnchorStyle}
              onClick={() => handleNavigate("/login")}
              onMouseEnter={(e) => e.target.style.color = "#0d3b1a"}
              onMouseLeave={(e) => e.target.style.color = "#1b5e2f"}
            >
              Back to Login
            </span>
          </div>

          <div style={linkStyle}>
            Don't have an account?{" "}
            <span
              style={linkAnchorStyle}
              onClick={() => handleNavigate("/register")}
              onMouseEnter={(e) => e.target.style.color = "#0d3b1a"}
              onMouseLeave={(e) => e.target.style.color = "#1b5e2f"}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </>
  );
}