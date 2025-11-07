import React, { useState } from "react";
import AuthService from "../services/AuthService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await AuthService.requestPasswordReset(email);
    setMsg("✅ If this email exists, reset link has been sent.");
  };

  return (
    <div style={{ marginTop: "5rem", textAlign: "center" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Link</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
