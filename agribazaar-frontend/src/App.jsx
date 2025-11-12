import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SelectRolePage from "./pages/SelectRolePage";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import BothDashboard from "./pages/BothDashboard"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EnterOTPPage from "./pages/EnterOTPPage";
import UploadProducts from './pages/UploadProducts';  
import UserProfile from "./pages/UserProfile";
import MyProducts from "./pages/MyProducts";  
import SalesAnalytics from "./pages/SalesAnalytics";


import RecentlyViewedPage from "./pages/RecentlyViewedPage";
import WishlistPage from "./pages/WishlistPage";
import RecommendedPage from "./pages/RecommendedPage";
import TopSellersPage from "./pages/TopSellersPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import SeasonalPicksPage from "./pages/SeasonalPicksPage";


const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

function App() {
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
          <Route path="/both/dashboard" element={<BothDashboard />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
          <Route path="/enter-otp" element={<EnterOTPPage />} />
          <Route path="/upload-products" element={<UploadProducts />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/sales-analytics" element={<SalesAnalytics />} />
          
          {/* Add new routes corresponding to new features */}
          <Route path="/buyer/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/buyer/wishlist" element={<WishlistPage />} />
          <Route path="/buyer/recommended" element={<RecommendedPage />} />
          <Route path="/buyer/top-sellers" element={<TopSellersPage />} />
          <Route path="/buyer/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/buyer/seasonal-picks" element={<SeasonalPicksPage />} />
          
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
