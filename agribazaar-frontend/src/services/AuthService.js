// src/services/AuthService.js

// ✅ Use import.meta.env for Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to handle API responses safely
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "Request failed");
  return data;
}

const AuthService = {
  // ✅ Registration API
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // ✅ OTP generate API
  sendOtp: async (email) => {
    const response = await fetch(`${API_BASE_URL}/otp/generate/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // ✅ OTP verify API
  verifyOtp: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/otp/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
  },

  // ✅ Login API
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // ✅ Google login API
  googleLogin: async (token) => {
    const response = await fetch(`${API_BASE_URL}/google-login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  },

  // ✅ Update user type API
  updateUserType: async (userType) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/user-type/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ user_type: userType }),
    });
    return handleResponse(response);
  },
};

export default AuthService;
