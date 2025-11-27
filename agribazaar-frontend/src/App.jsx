import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SelectRolePage from "./pages/SelectRolePage";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
// import BothDashboard from "./pages/BothDashboard"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EnterOTPPage from "./pages/EnterOTPPage";
import UploadProducts from './pages/UploadProducts';  
import UserProfile from "./pages/UserProfile";
import MyProducts from "./pages/MyProducts";  
import SalesAnalytics from "./pages/SalesAnalytics";

import ProfileFarmer from './pages/profileFarmer';

import RecentlyViewedPage from "./pages/RecentlyViewedPage";
import WishlistPage from "./pages/WishlistPage";
import RecommendedPage from "./pages/RecommendedPage";
import TopSellersPage from "./pages/TopSellersPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import SeasonalPicksPage from "./pages/SeasonalPicksPage";
import AddressesPage from './pages/AddressesPage';

import CartPage from "./pages/CartPage";
import NotificationsPage from "./pages/NotificationsPage";
import RewardsPage from "./pages/RewardsPage";
import SettingsPage from "./pages/SettingsPage";

import OrdersPage from './pages/OrdersPage';
import TrackOrdersPage from './pages/TrackOrdersPage';
import ReorderPage from './pages/ReorderPage';

// Shop by Category pages
import SeedsPage from "./pages/SeedsPage";
import FertilizersPage from "./pages/FertilizersPage";
import ToolsPage from "./pages/ToolsPage";
import EquipmentPage from "./pages/EquipmentPage";
import IrrigationPage from "./pages/IrrigationPage";

import AdminProductUploadPage from "./pages/AdminProductUploadPage";
import AdminProductListPage from "./pages/AdminProductListPage";

import axios from "axios";
import React, { useEffect } from "react";
import SearchResults from './pages/SearchResults';


const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";


function App() {
  useEffect(() => {
    // Axios interceptor to refresh token on 401 response
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user || !user.refresh) {
            window.location.href = "/login";
            return Promise.reject(error);
          }
          try {
            const response = await axios.post("/api/token/refresh/", {
              refresh: user.refresh,
            });
            const newAccessToken = response.data.access;
            user.access = newAccessToken;
            localStorage.setItem("user", JSON.stringify(user));
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-role" element={<SelectRolePage  />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          {/* <Route path="/both/dashboard" element={<BothDashboard />} /> */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
          <Route path="/enter-otp" element={<EnterOTPPage />} />
          <Route path="/upload-products" element={<UploadProducts />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/farmer/profile" element={<ProfileFarmer />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/sales-analytics" element={<SalesAnalytics />} />
          
          {/* Add new routes corresponding to new features */}
          <Route path="/buyer/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/buyer/wishlist" element={<WishlistPage />} />
          <Route path="/buyer/recommended" element={<RecommendedPage />} />
          <Route path="/buyer/top-sellers" element={<TopSellersPage />} />
          <Route path="/buyer/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/buyer/seasonal-picks" element={<SeasonalPicksPage />} />
          <Route path="/addresses" element={<AddressesPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/addresses" element={<AddressesPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/track" element={<TrackOrdersPage />} />
          <Route path="/orders/reorder" element={<ReorderPage />} />
          <Route path="/search" element={<SearchResults />} />
          
          <Route path="/seeds" element={<SeedsPage />} />
          <Route path="/fertilizers" element={<FertilizersPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/irrigation" element={<IrrigationPage />} />
          <Route path="/admin/upload-product" element={<AdminProductUploadPage />} />
          <Route path="/admin/products" element={<AdminProductListPage />} />
          
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
