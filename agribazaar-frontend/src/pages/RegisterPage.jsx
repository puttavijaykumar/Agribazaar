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
      // 1️⃣ Register the user
      const res = await AuthService.register(formData);
      const email = res.email || res.data?.email || formData.email; // fallback safe lookup

      // 2️⃣ Send OTP email
      await AuthService.sendOtp(email);

      setMessage("✅ Registration successful! OTP sent to your email.");

      // 3️⃣ Move to OTP verification page
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1200);

    } catch (error) {
      setMessage(
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.username?.[0] ||
        "❌ Registration failed. Please try again."
      );
    }

    setSubmitting(false);
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage("");
    setSubmitting(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await AuthService.registerGoogle(decoded);
      await AuthService.sendOtp(decoded.email);
      setMessage("✅ Google registration successful! OTP sent.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: decoded.email } });
      }, 1200);
    } catch (err) {
      setMessage("⚠️ Google registration failed.");
    }
    setSubmitting(false);
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
            {/* Username */}
            <input type="text" name="username" placeholder="Username"
              value={formData.username} onChange={handleChange}
              style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
              required disabled={submitting} />

            {/* Email */}
            <input type="email" name="email" placeholder="Email"
              value={formData.email} onChange={handleChange}
              style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px" }}
              required disabled={submitting} />

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} name="password"
                placeholder="Password" value={formData.password} onChange={handleChange}
                style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px", width: "100%" }}
                required disabled={submitting} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 8, top: 10, background: "none", border: "none" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: "relative" }}>
              <input type={showConfirmPassword ? "text" : "password"} name="password2"
                placeholder="Confirm Password" value={formData.password2} onChange={handleChange}
                style={{ border: "1px solid #ccd", borderRadius: 8, padding: "10px", width: "100%" }}
                required disabled={submitting} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: 8, top: 10, background: "none", border: "none" }}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit"
              style={{
                backgroundColor: colors.primaryGreen, color: "#fff",
                border: "none", borderRadius: 9, padding: "12px",
                fontWeight: 600, fontSize: "1.08rem", marginTop: 10,
                cursor: submitting ? "not-allowed" : "pointer"
              }}
              disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>

          {message && (
            <p style={{
              marginTop: 16,
              textAlign: "center",
              color: message.startsWith("✅") ? colors.primaryGreen : "#e35656"
            }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: 20, textAlign: "center" }}>
            Already registered? <Link to="/login" style={{ color: colors.secondaryGreen }}>Login</Link>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default RegisterPage;
