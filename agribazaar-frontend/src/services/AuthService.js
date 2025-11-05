import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Register
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


// Login
const login = async (loginData) => {
  return await axios.post(`${API_URL}/login/`, loginData);
};

// Google auth placeholder (backend implementation later)
const registerGoogle = async (googleUser) => {
  const response = await axios.post(
    `${API_URL}/register/google/`,
    { email: googleUser.email, name: googleUser.name },
    { withCredentials: true }
  );
  return response.data;
};


export default { register, login, registerGoogle };
