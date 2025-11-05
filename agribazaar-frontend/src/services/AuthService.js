import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
// Make sure your .env does NOT end with a slash (correct example):
// VITE_API_BASE_URL=https://agribazaar-1.onrender.com/api

// ✅ Register User (Normal Signup)
const register = async (formData) => {
  const payload = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    password2: formData.password2,
  };

  const response = await axios.post(`${API_URL}/register/`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

// ✅ Login User (Email + Password)
const login = async (loginData) => {
  const response = await axios.post(`${API_URL}/login/`, loginData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // allow session cookies if backend uses them
  });
  return response.data;
};

// ✅ Google Login (Signup + Login combined)
const googleLogin = async (googleUser) => {
  const response = await axios.post(
    `${API_URL}/google-login/`,
    {
      email: googleUser.email,
      name: googleUser.name,
    },
    { withCredentials: true } // maintain authenticated session
  );

  return response.data;
};

// ✅ Export Functions
export default {
  register,
  login,
  googleLogin,
};
