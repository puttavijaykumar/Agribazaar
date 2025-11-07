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
    googleUser,
    { headers: { "Content-Type": "application/json" } }
  );

  // ✅ Store user session + tokens
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
        Authorization: `Bearer ${token}`, // ✅ IMPORTANT
        "Content-Type": "application/json",
      },
    }
  );

  // ✅ Update stored user with new role
  const user = JSON.parse(localStorage.getItem("user"));
  user.role = role;
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
  googleLogin,
  logout,
  setRole,

};
