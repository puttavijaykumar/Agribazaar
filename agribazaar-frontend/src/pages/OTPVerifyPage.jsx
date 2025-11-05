import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const OTPVerifyPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await AuthService.verifyOtp({ email, otp });
      setMessage("✅ Email verified! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setMessage("❌ Invalid OTP.");
    }
    setSubmitting(false);
  };

  const resendOtp = async () => {
    await AuthService.sendOtp(email);
    setMessage("✅ OTP resent to your email.");
  };

  return (
    <div style={{ background: "#f1f8e9", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: 14, width: 340 }}>
        <h2 style={{ color: "#388e3c", textAlign: "center", marginBottom: 10 }}>Verify OTP</h2>
        <p style={{ textAlign: "center", fontSize: ".9rem", color: "#666" }}>{email}</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
          <button disabled={submitting} style={{ background: "#388e3c", color: "#fff", padding: 10, borderRadius: 8 }}>
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button onClick={resendOtp} style={{ marginTop: 10, border: "none", background: "transparent", color: "#388e3c" }}>
          Resend OTP
        </button>

        {message && <p style={{ marginTop: 14, textAlign: "center" }}>{message}</p>}
      </div>
    </div>
  );
};

export default OTPVerifyPage;
