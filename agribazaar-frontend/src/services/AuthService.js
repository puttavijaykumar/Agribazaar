import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL; 
// IMPORTANT: VITE_API_BASE_URL must NOT end with a trailing slash
// Example: https://agribazaar-1.onrender.com/api

// 1️⃣ Register User (no OTP here)
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data; // Returns { message, email }
};

// 2️⃣ Send OTP after registration
const sendOtp = async (email) => {
  const response = await axios.post(
    `${API_URL}/send-otp/`,
    { email },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // Returns { message }
};

// 3️⃣ Verify OTP to activate account
const verifyOtp = async ({ email, otp }) => {
  const response = await axios.post(
    `${API_URL}/verify-otp/`,
    { email, otp },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // Returns { message }
};

// 4️⃣ Login (After OTP verification)
const login = async (loginData) => {
  const response = await axios.post(`${API_URL}/login/`, loginData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 5️⃣ Google Login/Signup (we will handle later)
const registerGoogle = () => {};
const loginGoogle = () => {};

export default {
  register,
  sendOtp,
  verifyOtp,
  login,
  registerGoogle,
  loginGoogle,
};
