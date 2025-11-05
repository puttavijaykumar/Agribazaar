import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import OTPVerifyPage from "./pages/OTPVerifyPage"; // ✅ Ensure file exists

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* OTP verification must be accessible directly */}
          <Route path="/verify-otp" element={<OTPVerifyPage />} />

          <Route path="/login" element={<LoginPage />} />

          {/* (Later) After OTP success:
              /select-role → /farmer-dashboard or /buyer-dashboard
          */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
