import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const OTPVerifyPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Email passed from RegisterPage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await AuthService.verifyOtp({ email, otp }); // Implement verifyOtp in your AuthService.js
      setMessage("✅ Email verified! You can login now.");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setMessage("❌ Invalid OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#f1f8e9", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "2rem", minWidth: 340, width: 340, boxShadow: "0 4px 16px #388e3c22" }}>
        <h2 style={{ color: "#388e3c", textAlign: "center", marginBottom: "16px" }}>
          Enter Email OTP
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="6-digit OTP from email"
            required
            disabled={submitting}
            style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#388e3c",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "12px",
              fontWeight: 600,
              fontSize: "1.08rem",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1
            }}
            disabled={submitting}
          >
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {message && (
          <p style={{ marginTop: 16, textAlign: "center", color: message.startsWith("✅") ? "#388e3c" : "#e35656" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OTPVerifyPage;
