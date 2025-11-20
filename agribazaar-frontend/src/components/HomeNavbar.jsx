// src/components/HomeNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, Package, Bell, MessageCircle, Trophy, User,
  Search, LogOut, Settings, MapPin, HelpCircle
} from "lucide-react";
import AuthService from "../services/AuthService";

const colors = {
  primaryGreen: "#388e3c",
  secondaryGreen: "#81c784",
  contrastText: "#263238",
};

const navbarStyle = {
  backgroundColor: colors.primaryGreen,
  color: "white",
  padding: "clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  backgroundColor: colors.secondaryGreen,
  color: colors.contrastText,
  borderRadius: "20px",
  padding: "clamp(0.4rem, 1.5vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)",
  margin: "0 clamp(0.2rem, 0.5vw, 0.5rem)",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
  fontWeight: "600",
  border: "none",
  whiteSpace: "nowrap",
};

const NavIcon = ({ icon: Icon, badge, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "relative",
      padding: "0.5rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    title={label}
    aria-label={label}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
      e.currentTarget.style.transform = "scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <Icon size={22} color="white" />
    {badge > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "#ff5252",
          color: "white",
          fontSize: "0.65rem",
          fontWeight: "bold",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 2s infinite",
        }}
      >
        {badge}
      </span>
    )}
  </button>
);

const HomeNavbar = ({
  user,   // object with at least user.role string: "buyer" | "farmer" | "both"
  cartCount = 0,
  notifCount = 0,
  chatUnreadCount = 0,
  points = 0,
}) => {
  const navigate = useNavigate();

  const [showOrders, setShowOrders] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const logout = () => {
    AuthService.logout();
    navigate("/login");
  };

  // Helpers to check role
  const isBuyer = user?.role === "buyer" || user?.role === "both";
  const isFarmer = user?.role === "farmer" || user?.role === "both";

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <nav style={navbarStyle}>
        <div
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onClick={() => navigate("/home")}
        >
          AgriBazaar
        </div>

        {/* Search Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          marginLeft: "2rem",
          marginRight: "2rem",
          gap: "0.5rem",
        }}>
          <Search size={24} color="white" />
          <form onSubmit={handleSearch} style={{ flex: 0.75, display: "flex" }}>
            <input
              type="search"
              placeholder="Search products, orders, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "20px",
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
              }}
            />
            <button type="submit" style={buttonStyle}>Search</button>
          </form>
        </div>

        {/* Buyer icons */}
        {isBuyer && (
          <>
            <NavIcon icon={Heart} badge={0} label="Wishlist" onClick={() => navigate("/buyer/wishlist")} />
            <NavIcon icon={ShoppingCart} badge={cartCount} label="Cart" onClick={() => navigate("/cart")} />
            <div style={{ position: "relative" }}>
              <NavIcon icon={Package} badge={0} label="Buyer Orders" onClick={() => setShowOrders(!showOrders)} />
              {showOrders && (
                <div style={popupMenuStyle}>
                  <LinkMenu to="/orders">My Orders</LinkMenu>
                  <LinkMenu to="/orders/track">Track Orders</LinkMenu>
                  <LinkMenu to="/orders/reorder">Reorder</LinkMenu>
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <NavIcon icon={Bell} badge={notifCount} label="Buyer Notifications" onClick={() => setShowNotifications(!showNotifications)} />
              {showNotifications && (
                <div style={popupMenuStyle}>
                  <p style={{ padding: "16px", fontSize: "0.9rem", color: "#666" }}>No new notifications</p>
                </div>
              )}
            </div>
            <NavIcon icon={MessageCircle} badge={chatUnreadCount} label="Buyer Chat" onClick={() => navigate("/buyer/chat")}/>
          </>
        )}

        {/* Farmer icons */}
        {isFarmer && (
          <NavIcon icon={Trophy} badge={points} label="Farmer Points" onClick={() => navigate("/rewards")} />
        )}

        {/* Profile Dropdown */}
        <div style={{ position: "relative" }}>
          <NavIcon icon={User} label="Profile" onClick={() => setShowProfile(!showProfile)} />
          {showProfile && (
            <div style={popupMenuStyleFull}>
              <div style={accountMenuHeaderStyle}>My Account</div>
              <LinkMenu to="/profile"><User size={16} /> Profile</LinkMenu>
              <LinkMenu to="/settings"><Settings size={16} /> Settings</LinkMenu>
              {isFarmer && <LinkMenu to="/addresses"><MapPin size={16} /> Addresses</LinkMenu>}
              {isFarmer && <LinkMenu to="/rewards"><Trophy size={16} /> My Points</LinkMenu>}
              <LinkMenu to="/help"><HelpCircle size={16} /> Help</LinkMenu>
              {user?.role === "both" && (
                <RoleSwitch />
              )}
              <button onClick={logout} style={logoutButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ffebee"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff3e0"}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

const popupMenuStyle = {
  position: "absolute",
  top: "100%",
  right: 0,
  backgroundColor: "white",
  color: "black",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  borderRadius: "8px",
  width: "240px",
  zIndex: 1000,
  marginTop: "0.5rem",
  overflow: "hidden",
};

const popupMenuStyleFull = {
  ...popupMenuStyle,
  width: "260px",
  overflow: "visible",
};

const accountMenuHeaderStyle = {
  padding: "12px 16px",
  backgroundColor: "#f0f8f5",
  borderBottom: "1px solid #eee",
  fontWeight: "600",
  fontSize: "0.95rem",
  color: "#263238",
};

const logoutButtonStyle = {
  width: "100%",
  padding: "12px 16px",
  cursor: "pointer",
  border: "none",
  background: "#fff3e0",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#d32f2f",
  transition: "background 0.2s",
};

const LinkMenu = ({ to, children }) => (
  <Link
    to={to}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 16px",
      textDecoration: "none",
      color: "#263238",
      fontSize: "0.9rem",
      transition: "background 0.2s",
      borderBottom: "1px solid #eee",
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
  >
    {children}
  </Link>
);

const RoleSwitch = () => {
  // You can enhance this to provide an actual role-switch functionality
  return (
    <div style={{
      padding: "12px 16px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      fontWeight: "600",
      color: "#388e3c",
      backgroundColor: "#e7f5e6",
    }}>
      Switch Role
    </div>
  );
};

export default HomeNavbar;
