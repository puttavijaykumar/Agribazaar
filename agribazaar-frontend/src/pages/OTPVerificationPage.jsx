import React, { useState } from 'react';

const OTPVerificationPage = ({ onVerify }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !otp) {
      setError('Email and OTP are required');
      return;
    }

    try {
      const response = await fetch('/api/otp/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'OTP verified successfully.');
        // You can redirect or update state here on success
      } else {
        setError(data.error || 'OTP verification failed.');
      }
    } catch (err) {
      setError('An error occurred, please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, backgroundColor: '#f1f8e9', borderRadius: 8 }}>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          required
        />
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Verify OTP
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: 15 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 15 }}>{error}</p>}
    </div>
  );
};

export default OTPVerificationPage;
