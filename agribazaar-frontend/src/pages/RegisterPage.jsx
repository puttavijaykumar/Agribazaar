import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", password2: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(formData);
      setMsg("✅ Registered successfully! Please login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setMsg("❌ Registration failed");
    }
  };

  const googleSuccess = (res) => {
    const user = jwtDecode(res.credential);
    AuthService.registerGoogle(user);
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" required />
        <input name="email" onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <input name="password2" type="password" onChange={handleChange} placeholder="Confirm Password" required />
        <button>Register</button>
      </form>
      <GoogleLogin onSuccess={googleSuccess} />
      <p>{msg}</p>
      <Link to="/login">Already have an account?</Link>
    </div>
  );
};

export default RegisterPage;
