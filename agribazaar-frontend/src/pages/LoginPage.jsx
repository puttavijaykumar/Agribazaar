import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  lightBg: "#f1f8e9",
  contrastText: "#263238",
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email,
        password
      }),
      credentials: 'include' // add this if your backend uses cookies/session for auth
    });
    const data = await res.json();
    if (res.ok) {
      // Store token/session as needed (localStorage, cookies, etc)
      // Example: localStorage.setItem("token", data.token);
      navigate('/'); // redirect to homepage on successful login
    } else {
      // Handle error (data.detail, etc)
      alert(data.detail || "Login failed. Please check your credentials.");
    }
  } catch (err) {
    alert("An error occurred. Please try again.");
  }
};


  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#232323",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 20 // ensures on top if something else is present
      }}
    >
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "2.5rem 2rem",
        backgroundColor: colors.lightBg,
        color: colors.contrastText,
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
      }}>
        <h2 style={{
          marginBottom: '1.6rem',
          color: colors.primaryGreen,
          fontSize: "2.1rem",
          fontWeight: 700,
          textAlign: "left"
        }}>
          Login to Agribazaar
        </h2>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: "1rem"
            }}
          />
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1.4rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: "1rem"
            }}
          />
          <button type="submit" style={{
            backgroundColor: colors.primaryGreen,
            color: 'white',
            padding: '0.8rem',
            width: '100%',
            borderRadius: 7,
            fontWeight: 'bold',
            fontSize: "1.18rem",
            letterSpacing: ".02rem"
          }}>
            Login
          </button>
        </form>
        <p style={{
          marginTop: '1.4rem',
          fontSize: "1rem"
        }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: colors.secondaryGreen, textDecoration: "underline" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
