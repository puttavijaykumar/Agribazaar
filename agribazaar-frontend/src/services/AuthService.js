import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default { register };
