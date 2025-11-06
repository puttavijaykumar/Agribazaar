import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Normal Register
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

// ✅ Normal Login
const login = async (loginData) => {
  const response = await axios.post(`${API_URL}/login/`, loginData, {
    headers: { "Content-Type": "application/json" },
  });

  // ✅ Store user session (so Login persists)
  localStorage.setItem("user", JSON.stringify(response.data));
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
    { headers: { "Content-Type": "application/json" } }
  );

  // ✅ Store user session locally (IMPORTANT)
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

// ✅ Logout function
const logout = () => {
  localStorage.removeItem("user"); // clear session
  window.location.href = "/login";  // ✅ Redirect to login page
};

// Save Role for Logged-in User
// Set Role
const setRole = async (role) => {
  const response = await axios.post(
    `${API_URL}/set-role/`,
    { role },
    { withCredentials: true }
  );
  return response.data;
};

export default {
  register,
  login,
  googleLogin,
  logout,
  setRole,

};
