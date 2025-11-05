import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(loginData);
      setMsg("✅ Logged in!");
    } catch {
      setMsg("❌ Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="email" onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <button>Login</button>
      </form>
      <p>{msg}</p>
      <Link to="/register">Create an account</Link>
    </div>
  );
};

export default LoginPage;
