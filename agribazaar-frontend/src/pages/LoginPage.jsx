import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import AuthService from '../services/AuthService';

const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  lightBg: "#f1f8e9",
  contrastText: "#263238"
};

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await AuthService.login({ email, password });

      // ✅ If backend says account not verified → send OTP & redirect to verify
      if (res?.requires_otp === true) {
        await AuthService.sendOtp(email);
        setMessage("⚠️ Your account is not verified. OTP sent again.");
        return setTimeout(() => navigate("/verify-otp", { state: { email } }), 1200);
      }

      setMessage("✅ Login successful!");
      setTimeout(() => navigate('/'), 1000);

    } catch (err) {
      setMessage(err?.response?.data?.detail || "❌ Login failed. Check your credentials.");
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage("");
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await AuthService.loginGoogle(decoded);

      if (res?.requires_otp === true) {
        await AuthService.sendOtp(decoded.email);
        setMessage("⚠️ Verify OTP sent to your Google email.");
        return setTimeout(() => navigate("/verify-otp", { state: { email: decoded.email } }), 1200);
      }

      setMessage("✅ Logged in with Google!");
      setTimeout(() => navigate('/'), 700);

    } catch (err) {
      setMessage("⚠️ Google login failed.");
    }
    setLoading(false);
  };

  const handleGoogleFailure = () => {
    setMessage("❌ Google login failed.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#232323",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: 350,
          padding: "2rem",
          backgroundColor: colors.lightBg,
          color: colors.contrastText,
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
        }}>
          <h2 style={{
            marginBottom: '1.3rem',
            color: colors.primaryGreen,
            fontSize: "2.0rem",
            fontWeight: 700,
            textAlign: "center"
          }}>
            Login to Agribazaar
          </h2>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
              disabled={loading}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
              disabled={loading}
            />
            <button type="submit" style={{
              backgroundColor: colors.primaryGreen,
              color: 'white',
              padding: '.85rem',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: "1rem",
              letterSpacing: ".01rem",
              marginTop: 5,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1
            }} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ margin: "16px 0", textAlign: "center", color: "#888" }}>
            <span>or login using</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              text="signin_with"
              shape="pill"
              width="260"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              disabled={loading}
            />
          </div>

          {message && (
            <p style={{ marginTop: 12, textAlign: "center", color: message.startsWith("✅") ? colors.primaryGreen : "#e35656" }}>
              {message}
            </p>
          )}

          <p style={{
            marginTop: '1.1rem',
            fontSize: ".97rem",
            textAlign: "center"
          }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: colors.secondaryGreen, textDecoration: "underline" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
