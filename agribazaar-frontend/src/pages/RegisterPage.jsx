import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await AuthService.register(formData);
      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1300);
    } catch (error) {
      setMessage(
        error?.response?.data?.password ||
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.username?.[0] ||
        "❌ Registration failed."
      );
    }

    setLoading(false);
  };

  // ✅ Google Signup Handler (with role redirect logic)
const handleGoogleSignup = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);

    const user = await AuthService.googleLogin({
      email: decoded.email,
      name: decoded.name,
    });

    // ✅ Check role
    if (!user.role) {
      navigate("/select-role");
    } else {
      navigate(`/${user.role}/dashboard`);
    }

  } catch (err) {
    setMessage("❌ Google login failed.");
  }
};



  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #c8e6c9",
    fontSize: ".95rem",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7)",
          padding: "20px",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            maxWidth: 420,
            width: "100%",
            padding: "2.5rem",
            boxShadow: "0 18px 45px rgba(46, 125, 50, 0.25)",
            border: "1px solid rgba(46, 125, 50, 0.2)",
            animation: "slideUp 0.6s ease-out",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "0.5rem",
              color: "#1b5e20",
              fontWeight: 700,
            }}
          >
            AgriBazaar
          </h2>

          <p style={{ textAlign: "center", color: "#558b2f", marginBottom: "2rem" }}>
            Create your account
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showPass2 ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <span
                onClick={() => setShowPass2(!showPass2)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPass2 ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              style={{
                background: buttonHover ? "#2e7d32" : "#388e3c",
                color: "white",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                transition: ".3s",
                marginTop: 4,
              }}
            >
              {loading ? "Creating account..." : "🌱 Register"}
            </button>
          </form>

          <div style={{ textAlign: "center", margin: "18px 0", color: "#558b2f" }}>or</div>

          {/* ✅ GOOGLE SIGNUP */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => setMessage("❌ Google sign-in failed")}
              width="330"
            />
          </div>

          {message && (
            <p style={{ textAlign: "center", marginTop: 12, color: message.startsWith("✅") ? "#1b5e20" : "#c62828" }}>
              {message}
            </p>
          )}

          <p style={{ textAlign: "center", marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1b5e20", fontWeight: 600 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;
