import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Register
const register = async (userData) => {
  return await axios.post(`${API_URL}/register/`, userData);
};

// Login
const login = async (loginData) => {
  return await axios.post(`${API_URL}/login/`, loginData);
};

// Google auth placeholder (backend implementation later)
const registerGoogle = async (googleData) => {
  return { message: "Google Sign-In Feature Coming Soon" };
};

export default { register, login, registerGoogle };
