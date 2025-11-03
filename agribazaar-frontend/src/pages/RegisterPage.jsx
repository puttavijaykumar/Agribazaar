import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthService from '../services/AuthService'; // ✅ Import your AuthService

const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  lightBg: "#f1f8e9",
  contrastText: "#263238",
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPass: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { name, email, password, confirmPass } = formData;

    if (password !== confirmPass) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const data = await AuthService.register({
        username: name,
        email,
        password,
        password2: confirmPass,
      });

      if (data && data.success) {
        setMessage('Registration successful! Please check your email for OTP.');
        navigate('/otp');
      } else {
        setError(data?.detail || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    // You can handle Google sign-in registration logic here if needed
    // e.g., AuthService.googleLogin(credentialResponse);
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => alert('Google Sign-In failed. Please try again.'),
    flow: 'implicit',
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#232323",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          padding: "2.5rem 2rem",
          backgroundColor: colors.lightBg,
          color: colors.contrastText,
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        }}
      >
        <h2
          style={{
            marginBottom: '1.6rem',
            color: colors.primaryGreen,
            fontSize: "2.1rem",
            fontWeight: 700,
            textAlign: "left",
          }}
        >
          Create your Agribazaar Account
        </h2>

        {/* Google Sign Up Button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "340px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderRadius: "6px",
              border: "1.5px solid #bbb",
              boxShadow: "0 2px 8px rgba(10,12,16,0.05)",
              color: "#666",
              fontWeight: "500",
              fontSize: "1.05rem",
              cursor: "pointer",
              minHeight: "50px",
              marginBottom: "1rem",
              transition: "box-shadow 0.15s",
            }}
            onClick={() => login()}
            onMouseOver={e => e.currentTarget.style.boxShadow = "0 2px 14px 2px #c1e8c6"}
            onMouseOut={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(10,12,16,0.05)"}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: 24, marginRight: 15 }}
            />
            <span>Sign up with Google</span>
          </div>
          <div
            style={{
              width: "80%",
              margin: "18px 0 8px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ flex: 1, height: 1, background: "#d8dadc" }}></span>
            <span style={{
              margin: "0 9px",
              color: "#888",
              fontWeight: 500,
              fontSize: "1rem"
            }}>or</span>
            <span style={{ flex: 1, height: 1, background: "#d8dadc" }}></span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPass"
            required
            value={formData.confirmPass}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: colors.primaryGreen,
              color: 'white',
              padding: '0.8rem',
              width: '100%',
              borderRadius: 7,
              fontWeight: 'bold',
              fontSize: "1.18rem",
              letterSpacing: ".02rem",
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </form>

        {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

        <p
          style={{
            marginTop: '1.4rem',
            fontSize: "1rem",
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: colors.secondaryGreen,
              textDecoration: "underline",
            }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
