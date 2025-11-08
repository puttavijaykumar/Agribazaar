// src/pages/EnterOTPPage.jsx
import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, useLocation } from "react-router-dom";

export default function EnterOTPPage() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await AuthService.verifyOtp(email, otp);
      setMsg("✅ OTP verified! You can now log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMsg(error.response?.data?.error || "❌ OTP verification failed.");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>Email OTP Verification</h2>
      <form onSubmit={handleVerify}>
        <input type="text" maxLength="6" placeholder="Enter 6-digit OTP"
          value={otp} onChange={e => setOtp(e.target.value)} required />
        <button type="submit">Verify OTP</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
