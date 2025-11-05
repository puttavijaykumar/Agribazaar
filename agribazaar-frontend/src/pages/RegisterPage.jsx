import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/AuthService";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  lightBg: "#f1f8e9",
  contrastText: "#263238",
};

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await AuthService.register(formData);
      setMessage("✅ Registration successful! Please verify the OTP sent to your email.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } }); // Pass email for OTP verification
      }, 1000);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "❌ Registration failed. Check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage("");
    setSubmitting(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await AuthService.registerGoogle(decoded);
      setMessage("✅ Registered using Google! Please verify the OTP sent to your Google email.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: decoded.email } }); // Pass Google email for OTP page
      }, 1000);
    } catch (err) {
      setMessage("⚠️ Google user already exists or registration failed.");
    }
    setSubmitting(false);
  };

  const handleGoogleFailure = () => {
    setMessage("❌ Google sign-up failed.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.lightBg,
      }}>
        <div style={{
          backgroundColor: "#fff",
          boxShadow: "0 4px 16px rgba(56,142,60,0.10)",
          borderRadius: 14,
          padding: "2rem",
          minWidth: 340,
          width: 340,
        }}>
          <h2 style={{
            fontSize: "1.7rem",
            fontWeight: "bold",
            marginBottom: 20,
            color: colors.primaryGreen,
            textAlign: "center"
          }}>
            Create your Agribazaar account
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
              required
              disabled={submitting}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
              required
              disabled={submitting}
            />
            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px", width: "100%" }}
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 8, top: 10,
                  background: "none", border: "none", cursor: "pointer", color: "#888"
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Confirm Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px", width: "100%" }}
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute", right: 8, top: 10,
                  background: "none", border: "none", cursor: "pointer", color: "#888"
                }}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: colors.primaryGreen,
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "12px",
                fontWeight: 600,
                fontSize: "1.08rem",
                marginTop: 10,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1
              }}
              disabled={submitting}
            >
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>
          <div style={{ margin: "18px 0", textAlign: "center", color: "#888" }}>
            <span>or sign up using</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              shape="pill"
              width="260"
              text="signup_with"
              disabled={submitting}
            />
          </div>
          {message && (
            <p style={{
              marginTop: 16, textAlign: "center",
              color: message.startsWith("✅") ? colors.primaryGreen : "#e35656"
            }}>
              {message}
            </p>
          )}
          <div style={{ marginTop: 20, textAlign: "center", fontSize: "0.97rem", color: "#555" }}>
            Already registered?{" "}
            <Link to="/login" style={{ color: colors.secondaryGreen, textDecoration: "underline" }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default RegisterPage;
