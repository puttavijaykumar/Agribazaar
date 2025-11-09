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
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        padding: "40px",
        maxWidth: "420px",
        width: "100%",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "12px"
          }}>
            🌱
          </div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#2d5016",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px"
          }}>
            Reset Password
          </h2>
          <p style={{
            color: "#666",
            fontSize: "14px",
            margin: "0",
            marginTop: "4px"
          }}>
            Create a new password for your AgriBazaar account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Password Input */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#2d5016",
              marginBottom: "8px"
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
                padding: "12px 14px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
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
              fontSize: "13px",
              fontWeight: "600",
              color: "#2d5016",
              marginBottom: "8px"
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
                padding: "12px 14px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
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
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {msg && (
            <div style={{
              background: "#efe",
              border: "1px solid #cfc",
              color: "#3c3",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500"
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
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginTop: "8px",
              boxShadow: "0 4px 12px rgba(45, 80, 22, 0.3)",
              letterSpacing: "0.5px"
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
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid #e0e0e0"
        }}>
          <p style={{ margin: "0", color: "#666", fontSize: "13px" }}>
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
    </div>
  );
}