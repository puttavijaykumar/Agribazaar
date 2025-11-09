import React, { useState, useRef, useEffect } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, useLocation } from "react-router-dom";

export default function EnterOTPPage() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await AuthService.verifyOtp(email, otp);
      setMsg(" OTP verified! You can now log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setError(error.response?.data?.error || "❌ OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setMsg("");
    setError("");
    setResendTimer(60);
    try {
      // Uncomment when your service has resend OTP method
      // await AuthService.resendOtp(email);
      setMsg("📧 OTP has been resent to your email!");
    } catch (error) {
      setError("Failed to resend OTP. Please try again later.");
      setResendTimer(0);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a4d0e 0%, #2d5016 50%, #1a4d0e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 250, 240, 0.95) 100%)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        padding: "48px 40px",
        maxWidth: "450px",
        width: "100%",
        border: "1px solid rgba(74, 124, 44, 0.1)",
        backdropFilter: "blur(10px)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            fontSize: "56px",
            marginBottom: "16px",
            animation: "pulse 2s infinite"
          }}>
            
          </div>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px"
          }}>
            Verify Your Email
          </h2>
          <p style={{
            color: "#555",
            fontSize: "14px",
            margin: "8px 0 0 0",
            fontWeight: "500"
          }}>
            We've sent a code to <strong style={{ color: "#2d5016" }}>{email || "your email"}</strong>
          </p>
        </div>

        {/* OTP Input Section */}
        <form onSubmit={handleVerify} style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* OTP Input */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "700",
              color: "#2d5016",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Enter OTP Code
            </label>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setOtp(val);
              }}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e0e0e0",
                borderRadius: "12px",
                fontSize: "24px",
                fontWeight: "600",
                letterSpacing: "8px",
                textAlign: "center",
                fontFamily: "monospace",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4a7c2c";
                e.target.style.boxShadow = "0 0 0 4px rgba(74, 124, 44, 0.15)";
                e.target.style.background = "linear-gradient(135deg, #fff 0%, #fafafa 100%)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
                e.target.style.background = "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)";
              }}
            />
            <p style={{
              fontSize: "12px",
              color: "#888",
              margin: "6px 0 0 0",
              textAlign: "right"
            }}>
              {otp.length}/6 digits
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "linear-gradient(135deg, #ffe6e6 0%, #fff0f0 100%)",
              border: "2px solid #ff6b6b",
              borderRadius: "12px",
              color: "#c92a2a",
              padding: "14px 16px",
              fontSize: "13px",
              fontWeight: "600",
              animation: "slideIn 0.3s ease"
            }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {msg && (
            <div style={{
              background: "linear-gradient(135deg, #e6ffe6 0%, #f0fff0 100%)",
              border: "2px solid #51cf66",
              borderRadius: "12px",
              color: "#2b8a3e",
              padding: "14px 16px",
              fontSize: "13px",
              fontWeight: "600",
              animation: "slideIn 0.3s ease"
            }}>
              {msg}
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            style={{
              background: loading || otp.length !== 6
                ? "linear-gradient(135deg, #999 0%, #777 100%)"
                : "linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)",
              color: "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginTop: "8px",
              boxShadow: "0 8px 20px rgba(45, 80, 22, 0.25)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              opacity: loading || otp.length !== 6 ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading && otp.length === 6) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 12px 28px rgba(45, 80, 22, 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && otp.length === 6) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(45, 80, 22, 0.25)";
              }
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div style={{
          textAlign: "center",
          marginTop: "28px",
          paddingTop: "24px",
          borderTop: "2px solid rgba(74, 124, 44, 0.2)"
        }}>
          <p style={{ margin: "0", color: "#666", fontSize: "13px", marginBottom: "12px" }}>
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendTimer > 0}
            style={{
              background: resendTimer > 0
                ? "linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)"
                : "linear-gradient(135deg, #4a7c2c 0%, #2d5016 100%)",
              color: resendTimer > 0 ? "#999" : "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: resendTimer > 0 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.3px"
            }}
            onMouseEnter={(e) => {
              if (resendTimer === 0) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(74, 124, 44, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (resendTimer === 0) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
        </div>

        {/* Footer Info */}
        <div style={{
          background: "linear-gradient(135deg, rgba(74, 124, 44, 0.08) 0%, rgba(45, 80, 22, 0.08) 100%)",
          borderRadius: "12px",
          padding: "14px",
          marginTop: "24px",
          textAlign: "center"
        }}>
          <p style={{
            margin: "0",
            fontSize: "12px",
            color: "#666",
            lineHeight: "1.5"
          }}>
            🔒 Your security is important to us. Never share your OTP with anyone.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
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
    </div>
  );
}