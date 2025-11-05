import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Standard form register
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Google OAuth register (pass Google profile info, backend should handle accordingly)
const registerGoogle = async (googleUser) => {
  // googleUser: { name, email, sub, etc }
  const response = await axios.post(`${API_URL}/register/google/`, googleUser, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Standard login
const login = async (loginData) => {
  const response = await axios.post(`${API_URL}/login/`, loginData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // if you use cookies/sessions
  });
  return response.data;
};

// Google OAuth login
const loginGoogle = async (googleUser) => {
  const response = await axios.post(`${API_URL}/login/google/`, googleUser, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

// OTP email verification
const verifyOtp = async ({ email, otp }) => {
  const response = await axios.post(`${API_URL}/verify-otp/`, { email, otp }, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default {
  register,
  registerGoogle,
  login,
  loginGoogle,
  verifyOtp
};
