import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AuthService from "../services/AuthService";

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPassword(uid, token, password);
      setMsg("✅ Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #2d5016 0%, #4a7c2c 50%, #2d5016 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(1rem, 4vw, 2rem)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: "white",
        borderRadius: "clamp(12px, 3vw, 16px)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        padding: "clamp(1.5rem, 6vw, 2.5rem)",
        maxWidth: "420px",
        width: "100%",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(1.5rem, 5vw, 2rem)" }}>
          <div style={{
            fontSize: "clamp(2.5rem, 8vw, 3rem)",
            marginBottom: "clamp(0.8rem, 2vw, 1rem)"
          }}>
            🌱
          </div>
          <h2 style={{
            fontSize: "clamp(1.5rem, 5vw, 1.75rem)",
            fontWeight: "700",
            color: "#2d5016",
            margin: "0 0 clamp(0.5rem, 1vw, 0.8rem) 0",
            letterSpacing: "-0.5px"
          }}>
            Reset Password
          </h2>
          <p style={{
            color: "#666",
            fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
            margin: "clamp(0.2rem, 1vw, 0.4rem) 0 0 0"
          }}>
            Create a new password for your AgriBazaar account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 1.2rem)" }}>
          {/* Password Input */}
          <div>
            <label style={{
              display: "block",
              fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
              fontWeight: "600",
              color: "#2d5016",
              marginBottom: "clamp(0.4rem, 1vw, 0.6rem)",
              textTransform: "uppercase",
              letterSpacing: "0.3px"
            }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "clamp(10px, 2vw, 12px) clamp(10px, 2vw, 14px)",
                border: "2px solid #e0e0e0",
                borderRadius: "clamp(6px, 1.5vw, 8px)",
                fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                fontFamily: "inherit",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                backgroundColor: "#fafafa"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4a7c2c";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(74, 124, 44, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.backgroundColor = "#fafafa";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label style={{
              display: "block",
              fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
              fontWeight: "600",
              color: "#2d5016",
              marginBottom: "clamp(0.4rem, 1vw, 0.6rem)",
              textTransform: "uppercase",
              letterSpacing: "0.3px"
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "clamp(10px, 2vw, 12px) clamp(10px, 2vw, 14px)",
                border: "2px solid #e0e0e0",
                borderRadius: "clamp(6px, 1.5vw, 8px)",
                fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                fontFamily: "inherit",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                backgroundColor: "#fafafa"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4a7c2c";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(74, 124, 44, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.backgroundColor = "#fafafa";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "linear-gradient(135deg, #ffe6e6 0%, #fff0f0 100%)",
              border: "2px solid #ff6b6b",
              color: "#c92a2a",
              padding: "clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2vw, 1.2rem)",
              borderRadius: "clamp(6px, 1.5vw, 8px)",
              fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
              fontWeight: "500",
              animation: "slideIn 0.3s ease"
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {msg && (
            <div style={{
              background: "linear-gradient(135deg, #e6ffe6 0%, #f0fff0 100%)",
              border: "2px solid #51cf66",
              color: "#2b8a3e",
              padding: "clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2vw, 1.2rem)",
              borderRadius: "clamp(6px, 1.5vw, 8px)",
              fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
              fontWeight: "500",
              animation: "slideIn 0.3s ease"
            }}>
              {msg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#999" : "linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)",
              color: "white",
              border: "none",
              padding: "clamp(10px, 2.5vw, 12px) clamp(1.5rem, 3vw, 1.8rem)",
              borderRadius: "clamp(6px, 1.5vw, 8px)",
              fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginTop: "clamp(0.5rem, 1vw, 0.8rem)",
              boxShadow: "0 4px 12px rgba(45, 80, 22, 0.3)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(45, 80, 22, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(45, 80, 22, 0.3)";
              }
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Back to Login */}
        <div style={{
          textAlign: "center",
          marginTop: "clamp(1.5rem, 3vw, 1.8rem)",
          paddingTop: "clamp(1rem, 2vw, 1.5rem)",
          borderTop: "1px solid #e0e0e0"
        }}>
          <p style={{ 
            margin: "0", 
            color: "#666", 
            fontSize: "clamp(0.75rem, 2vw, 0.85rem)" 
          }}>
            Remember your password?{" "}
            <a 
              href="/login"
              style={{
                color: "#4a7c2c",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "#2d5016"}
              onMouseLeave={(e) => e.target.style.color = "#4a7c2c"}
            >
              Sign in here
            </a>
          </p>
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
        }

        /* Small Tablets (481px - 600px) */
        @media (max-width: 600px) {
          input, textarea {
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
    </div>
  );
}