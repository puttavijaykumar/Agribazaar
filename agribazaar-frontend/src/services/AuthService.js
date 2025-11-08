import axios from "axios";

axios.defaults.withCredentials = true;
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
  const response = await axios.post(`${API_URL}/login/`, loginData);

  localStorage.setItem("user", JSON.stringify(response.data));
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};

//  Verify OTP
const verifyOtp = async (email, otp) => {
  return await axios.post(`${API_URL}/verify-otp/`, { email, otp });
};

//  Send Reset Link
const requestPasswordReset = async (email) => {
  return await axios.post(`${API_URL}/forgot-password/`, { email });
};

// ✅ Submit New Password
const resetPassword = async (uid, token, password) => {
  return await axios.post(`${API_URL}/reset-password/${uid}/${token}/`, { password });
};

// ✅ Google Login (Signup + Login combined)
const googleLogin = async (googleUser) => {
  const response = await axios.post(
    `${API_URL}/google-login/`,
    {
      email: googleUser.email,
      name: googleUser.name,
    },
    { withCredentials: true }
  );

  // ✅ Store user + tokens
  localStorage.setItem("user", JSON.stringify(response.data));
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};

// ✅ Set Role
const setRole = async (role) => {
  const token = localStorage.getItem("access");

  const response = await axios.post(
    `${API_URL}/set-role/`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send JWT token
        "Content-Type": "application/json",
      },
    }
  );

  // ✅ Update stored user role
  const user = JSON.parse(localStorage.getItem("user")) || {};
  user.role = response.data.role;
  localStorage.setItem("user", JSON.stringify(user));

  return response.data;
};



// ✅ Logout function
const logout = () => {
  localStorage.removeItem("user"); // clear session
  window.location.href = "/login";  // ✅ Redirect to login page
};


export default {
  register,
  login,
  verifyOtp,
  googleLogin,
  logout,
  setRole,
  requestPasswordReset,
  resetPassword
};
