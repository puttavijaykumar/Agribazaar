import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AuthService from "../services/AuthService";

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    await AuthService.resetPassword(uid, token, password);
    setMsg("✅ Password reset successful!");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <input type="password" placeholder="New Password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Update Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
