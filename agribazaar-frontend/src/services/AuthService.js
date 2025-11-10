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

//  Fetch user profile info
const getUserProfile = async () => {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No access token found.");

  const response = await axios.get(`${API_URL}/api/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  return response.data;
};

// List products of logged-in farmer
const getProducts = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/products/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Upload new product, accepts FormData for images
const createProduct = async (formData) => {
  const token = localStorage.getItem("access");

  const response = await axios.post(`${API_URL}/products/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Update existing product
const updateProduct = async (id, formData) => {
  const token = localStorage.getItem("access");

  const response = await axios.put(`${API_URL}/products/${id}/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Delete product by ID
const deleteProduct = async (id) => {
  const token = localStorage.getItem("access");

  const response = await axios.delete(`${API_URL}/products/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Update user profile data - e.g., to update address
const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("access");
  const response = await axios.put(`${API_URL}/api/profile/`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


export default {
  register,
  login,
  verifyOtp,
  googleLogin,
  logout,
  setRole,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateUserProfile, // <-- add this here
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
