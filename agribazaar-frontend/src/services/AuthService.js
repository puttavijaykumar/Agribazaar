import axios from "axios";
import authHeader from './authHeader'; 

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_BASE_URL;

//  Normal Register
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

//  Normal Login
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

//  Submit New Password
const resetPassword = async (uid, token, password) => {
  return await axios.post(`${API_URL}/reset-password/${uid}/${token}/`, { password });
};

//  Google Login (Signup + Login combined)
const googleLogin = async (googleUser) => {
  const response = await axios.post(
    `${API_URL}/google-login/`,
    {
      email: googleUser.email,
      name: googleUser.name,
    },
    { withCredentials: true }
  );

  //  Store user + tokens
  localStorage.setItem("user", JSON.stringify(response.data));
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};

//  Set Role
const setRole = async (role) => {
  const token = localStorage.getItem("access");

  const response = await axios.post(
    `${API_URL}/set-role/`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`, //  Send JWT token
        "Content-Type": "application/json",
      },
    }
  );

  //  Update stored user role
  const user = JSON.parse(localStorage.getItem("user")) || {};
  user.role = response.data.role;
  localStorage.setItem("user", JSON.stringify(user));

  return response.data;
};



//  Logout function
const logout = () => {
  localStorage.removeItem("user"); // clear session
  window.location.href = "/login";  // Redirect to login page
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
// Fetch logged-in user's own products
const getMyProducts = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/my-products/`, {
    headers: { Authorization: `Bearer ${token}` }
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
const updateProduct = async (id, { price, quantity }) => {
  const token = localStorage.getItem("access");
  const response = await axios.patch(
    `${API_URL}/products/${id}/`,
    { price, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
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

// Fetch sales analytics data with optional date filters
const getSalesAnalytics = async (fromDate, toDate) => {
  let url = `${API_URL}/analytics/`;
  if (fromDate && toDate) {
    url += `?from=${fromDate}&to=${toDate}`;
  }
  const token = localStorage.getItem("access");
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Fetch Recently Viewed Products for logged-in user
const fetchRecentlyViewed = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/recently-viewed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch order summary for logged-in user
const fetchOrderSummary = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/orders/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch wishlist/favorites
const fetchWishlist = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch recommended products for user
const fetchRecommended = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/recommended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch top sellers/farmers
const fetchTopSellers = async () => {
  const response = await axios.get(`${API_URL}/sellers/top`);
  return response.data;
};

// Fetch featured new arrivals
const fetchNewArrivals = async () => {
  const response = await axios.get(`${API_URL}/products/new-arrivals`);
  return response.data;
};

// Fetch seasonal picks
const fetchSeasonalPicks = async () => {
  const response = await axios.get(`${API_URL}/products/seasonal-picks`);
  return response.data;
};

// Fetch cart count for user
const fetchCartCount = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/cart/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch unread notifications count for user
const fetchNotificationCount = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch unread chat message count for user
const fetchChatUnreadCount = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/chat/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch user reward points
const fetchRewardPoints = async (userId) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/users/${userId}/rewards/points`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cart APIs
const fetchCart = async () => {
  const response = await axios.get(`${API_URL}/cart/`, { headers: authHeader() });
  return response.data;
};

// Notifications
const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications/`, { headers: authHeader() });
  return response.data;
};

// Reward History
const fetchRewardHistory = async () => {
  const response = await axios.get(`${API_URL}/rewards/history/`, { headers: authHeader() });
  return response.data;
};


// Settings
const fetchSettings = async () => {
  const response = await axios.get(`${API_URL}/settings/`, { headers: authHeader() });
  return response.data;
};

const updateSettings = async (settingsData) => {
  const response = await axios.put(`${API_URL}/settings/`, settingsData, { headers: authHeader() });
  return response.data;
};

// Addresses
const fetchAddresses = async () => {
  const response = await axios.get(`${API_URL}/addresses/`, { headers: authHeader() });
  return response.data;
};

const createAddress = async (addressData) => {
  const response = await axios.post(`${API_URL}/addresses/`, addressData, { headers: authHeader() });
  return response.data;
};

const updateAddress = async (id, addressData) => {
  const response = await axios.put(`${API_URL}/addresses/${id}/`, addressData, { headers: authHeader() });
  return response.data;
};

const deleteAddress = async (id) => {
  const response = await axios.delete(`${API_URL}/addresses/${id}/`, { headers: authHeader() });
  return response.data;
};

// list of products matching search
const searchProducts = async (query) => {
  const token = localStorage.getItem('access');
  try {
    const response = await axios.get(`${API_URL}/products/`, {
      params: { search: query },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Fetch all admin products with optional category filter
// const fetchAdminProducts = async (category = null) => {
//   const token = localStorage.getItem("access");
//   let url = `${API_URL}/admin-products/`;
//   if (category) url += `?category=${encodeURIComponent(category)}`;
//   const response = await axios.get(url, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// Fetch a SINGLE admin product by id
const fetchAdminProductById = async (id) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/admin-products/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Add a new admin product (ADMIN ONLY)
const createAdminProduct = async (formData) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(`${API_URL}/admin-products/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update admin product (ADMIN ONLY)
const updateAdminProduct = async (id, formData) => {
  const token = localStorage.getItem("access");
  const response = await axios.put(
    `${API_URL}/admin-products/${id}/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Delete admin product (ADMIN ONLY)
const deleteAdminProduct = async (id) => {
  const token = localStorage.getItem("access");
  const response = await axios.delete(
    `${API_URL}/admin-products/${id}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Fetch agriculture news updates (public, no auth needed)
const fetchAgriNews = async () => {
  const response = await axios.get(`${API_URL}/api/agri-news/latest/`);
  return response.data;
};

// Fetch products by category (excludes Top Offers)
const fetchAdminProducts = async (category = null) => {
  let url = `${API_URL}/admin-products/`;
  
  if (category) {
    url += `?category=${encodeURIComponent(category)}`;
  }
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};


// Fetch top offers only
const fetchTopOffers = async () => {
  const url = `${API_URL}/top-offers/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// Fetch flash deals
const fetchFlashDeals = async () => {
  const url = `${API_URL}/admin-products/flash_deals/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// Fetch seasonal offers
const fetchSeasonalOffers = async () => {
  const url = `${API_URL}/admin-products/seasonal_offers/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// Fetch limited stock
const fetchLimitedStock = async () => {
  const url = `${API_URL}/admin-products/limited_stock/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// Fetch trending products
const fetchTrending = async () => {
  const url = `${API_URL}/admin-products/trending/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// Fetch featured products
const fetchFeaturedProducts = async () => {
  const url = `${API_URL}/featured-products/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// Fetch products by specific category
const fetchProductsByCategory = async (category) => {
  const url = `${API_URL}/category/${encodeURIComponent(category)}/`;
  
  const response = await axios.get(url, {
    headers: authHeader(),
  });
  return response.data;
};

// In AuthService.js or AuthServices.jsx
const fetchLiveMarketPrices = async () => {
  const url = `${API_URL}/live-market-prices/`; 
  const response = await axios.get(url, {
    headers: authHeader(), 
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
  updateUserProfile,
  getMyProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSalesAnalytics,  // <-- Added Sales Analytics here
  fetchRecentlyViewed,
  fetchOrderSummary,
  fetchWishlist,
  fetchRecommended,
  fetchTopSellers,
  fetchNewArrivals,
  fetchSeasonalPicks,
  fetchCartCount,
  fetchNotificationCount,
  fetchChatUnreadCount,
  fetchRewardPoints,
  fetchCart,
  fetchNotifications,
  fetchRewardHistory,
  fetchSettings,
  updateSettings,
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  searchProducts,
  fetchAdminProducts,
  fetchAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAgriNews,
  fetchLiveMarketPrices,
  fetchTopOffers,
  fetchFlashDeals,
  fetchSeasonalOffers,
  fetchLimitedStock,
  fetchTrending,
  fetchFeaturedProducts,
  fetchProductsByCategory,
};
