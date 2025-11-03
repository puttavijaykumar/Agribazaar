import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import AuthService from "../services/AuthService";
import { Eye, EyeOff } from "lucide-react"; // simple icon library

const clientId =
  "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await AuthService.register(formData);
      setMessage("✅ Registration successful!");
      console.log(res);
    } catch (error) {
      setMessage("❌ Registration failed. Check your inputs.");
      console.error(error.response?.data);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    console.log("Google user:", decoded);

    const googleData = {
      username: decoded.name,
      email: decoded.email,
      password: "GoogleAuth@123",
      password2: "GoogleAuth@123",
    };

    AuthService.register(googleData)
      .then(() => setMessage("✅ Registered successfully using Google!"))
      .catch(() =>
        setMessage("⚠️ Google user already exists or registration failed.")
      );
  };

  const handleGoogleFailure = () => {
    setMessage("❌ Google sign-up failed.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-8 w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 rounded w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                className="border p-2 rounded w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </form>

          {/* Google Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-2">Or sign up using</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              text="signup_with"
              shape="pill"
            />
          </div>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default RegisterPage;
