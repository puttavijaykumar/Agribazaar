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
    {
      withCredentials: true,  // ✅ *MOST IMPORTANT*
      headers: { "Content-Type": "application/json" }
    }
  );

  // ✅ Store user locally so UI knows login state
  localStorage.setItem("user", JSON.stringify(response.data));

  return response.data;
};

// ✅ Set Role
const setRole = async (role) => {
  const response = await axios.post(
    `${API_URL}/set-role/`,
    { role },
    { withCredentials: true }
  );

  // ✅ Update user in localStorage so frontend remembers the role
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
  googleLogin,
  logout,
  setRole,

};
