// src/components/BuyerNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, Package, Bell, MessageCircle, Trophy, User,
  LogOut, Settings, MapPin, HelpCircle, Search, Leaf
} from "lucide-react";
import AuthService from "../services/AuthService";

// Colors/theme
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
  position: "sticky",
  top: 0,
  zIndex: 100,
  flexWrap: "wrap"
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

// Categories for dropdown
const categories = [
  "Grains", "Spices", "Fruits", "Vegetables", "Dairy", "Seeds", "Machinery"
];

const BuyerNavbar = ({
  cartCount = 0,
  notifCount = 0,
  chatUnreadCount = 0,
  points = 0,
  user = null  // <-- Pass user object as prop
}) => {
  const navigate = useNavigate();

  const [showOrders, setShowOrders] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
  };

  const logout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <nav style={navbarStyle}>
        {/* Brand logo/name */}
        <div
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
          }}
          onClick={() => navigate("/buyer/dashboard")}
        >
          <Leaf size={24} color="#aed581" style={{ marginRight: 2 }} />
          AgriBazaar
        </div>
        {/* Category Dropdown & Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            marginLeft: "2rem",
            marginRight: "2rem",
            minWidth: 0,
            gap: "0.5rem"
          }}
        >
          {/* Category Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCategoryMenu((prev) => !prev)}
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                marginRight: 13,
                letterSpacing: 0.5
              }}
            >
              Categories ▾
            </button>
            {showCategoryMenu && (
              <div style={{
                position: "absolute",
                left: 0,
                top: "110%",
                background: "white",
                color: "#263238",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.13)",
                minWidth: 150,
                zIndex: 20,
                fontWeight: 500
              }}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setShowCategoryMenu(false);
                      navigate(`/search?query=${encodeURIComponent(cat)}`);
                    }}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f7fef7"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              flex: "1 0 220px",
              maxWidth: 420,
              minWidth: 120,
              display: "flex",
              alignItems: "center",
              background: "white",
              borderRadius: "20px",
              padding: "0.1rem 0.26rem",
              marginRight: "0.5rem"
            }}
          >
            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "20px",
                padding: "0.69rem 1.1rem",
                fontSize: "0.98rem",
                outline: "none",
                background: "transparent"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.62rem 1.1rem",
                borderRadius: "20px",
                background: "#aed581",
                color: "#388e3c",
                border: "none",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer"
              }}
            >
              <Search size={18} style={{ marginBottom: -2, marginRight: 3 }} />
              Search
            </button>
          </form>
        </div>
        {/* Right Side: All Your Other Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <NavIcon icon={Heart} badge={0} label="Wishlist" onClick={() => navigate("/buyer/wishlist")} />
          <NavIcon icon={ShoppingCart} badge={cartCount} label="Cart" onClick={() => navigate("/cart")} />
          {/* Orders dropdown */}
          <div style={{ position: "relative" }}>
            <NavIcon icon={Package} badge={0} label="Orders" onClick={() => setShowOrders(!showOrders)} />
            {showOrders && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  width: "200px",
                  zIndex: 1000,
                  marginTop: "0.5rem",
                }}
              >
                <Link to="/orders" style={menuLinkStyle}>My Orders</Link>
                <Link to="/orders/track" style={menuLinkStyle}>Track Orders</Link>
                <Link to="/orders/reorder" style={menuLinkStyle}>Reorder</Link>
              </div>
            )}
          </div>
          {/* Notifications dropdown */}
          <div style={{ position: "relative" }}>
            <NavIcon icon={Bell} badge={notifCount} label="Notifications" onClick={() => setShowNotifications(!showNotifications)} />
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  width: "300px",
                  zIndex: 1000,
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "0.5rem",
                }}
              >
                <p style={{ padding: "16px", fontSize: "0.9rem", color: "#666" }}>No new notifications</p>
              </div>
            )}
          </div>
          <NavIcon icon={MessageCircle} badge={chatUnreadCount} label="Chat" />
          {/* SWITCH DASHBOARD BUTTON: Only for "both" role */}
          {user?.role === "both" && (
            <button
              onClick={() => navigate("/farmer/dashboard")}
              style={{
                background: "#e8f5e9",
                color: "#388e3c",
                border: "1px solid #aed581",
                fontWeight: 700,
                borderRadius: 8,
                padding: "0.41rem 1.1rem",
                marginLeft: 14,
                cursor: "pointer"
              }}
            >
              Farmer Dashboard
            </button>
          )}
          {/* Profile dropdown */}
          <div style={{ position: "relative" }}>
            <NavIcon icon={User} label="Profile" onClick={() => setShowProfile(!showProfile)} />
            {showProfile && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  width: "220px",
                  zIndex: 1000,
                  overflow: "hidden",
                  marginTop: "0.5rem",
                }}
              >
                <div style={{
                  padding: "12px 16px",
                  backgroundColor: "#f0f8f5",
                  borderBottom: "1px solid #eee",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  color: "#263238",
                }}>
                  My Account
                </div>
                <Link to="/profile" style={menuLinkStyleProfile}><User size={16} /> Profile</Link>
                <Link to="/settings" style={menuLinkStyleProfile}><Settings size={16} /> Settings</Link>
                <Link to="/addresses" style={menuLinkStyleProfile}><MapPin size={16} /> Addresses</Link>
                <Link to="/rewards" style={menuLinkStyleProfile}><Trophy size={16} /> My Points</Link>
                <Link to="/help" style={menuLinkStyleProfile}><HelpCircle size={16} /> Help</Link>
                <button
                  onClick={logout}
                  style={{
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
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ffebee"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff3e0"}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

// Shared styles for menu items for brevity
const menuLinkStyle = {
  display: "block",
  padding: "12px 16px",
  borderBottom: "1px solid #eee",
  textDecoration: "none",
  color: "#263238",
  fontSize: "0.9rem",
  transition: "background 0.2s",
  cursor: "pointer",
};

const menuLinkStyleProfile = {
  ...menuLinkStyle,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderBottom: "1px solid #eee",
};

export default BuyerNavbar;
