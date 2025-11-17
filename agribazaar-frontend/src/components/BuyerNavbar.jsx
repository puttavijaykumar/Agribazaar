// src/components/BuyerNavbar.jsx
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

const BuyerNavbar = ({
  cartCount = 0,
  notifCount = 0,
  chatUnreadCount = 0,
  points = 0,
  searchQuery = "",
  setSearchQuery = () => {},
  handleSearch = () => {}
}) => {
  const navigate = useNavigate();
  const [showOrders, setShowOrders] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
        <div
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onClick={() => navigate("/buyer/dashboard")}
        >
          AgriBazaar
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          marginLeft: "2rem",
          marginRight: "2rem",
          gap: "0.5rem"
        }}>
          <Search size={24} color="white" />
          <form onSubmit={handleSearch} style={{ flex: 0.75, display: "flex" }}>
            <input
              type="search"
              placeholder="Search products"
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <NavIcon icon={Heart} badge={0} label="Wishlist" onClick={() => navigate("/buyer/wishlist")} />
          <NavIcon icon={ShoppingCart} badge={cartCount} label="Cart" onClick={() => navigate("/cart")} />
          <div style={{ position: "relative" }}>
            <NavIcon icon={Package} badge={0} label="Orders" onClick={() => setShowOrders(!showOrders)} />
            {showOrders && (
              <div style={{
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
              }}>
                <Link to="/orders" style={{ display: "block", padding: "12px 16px", borderBottom: "1px solid #eee", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s" }} onMouseEnter={e => e.target.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>My Orders</Link>
                <Link to="/orders/track" style={{ display: "block", padding: "12px 16px", borderBottom: "1px solid #eee", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s" }} onMouseEnter={e => e.target.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>Track Orders</Link>
                <Link to="/orders/reorder" style={{ display: "block", padding: "12px 16px", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s" }} onMouseEnter={e => e.target.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>Reorder</Link>
              </div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <NavIcon icon={Bell} badge={notifCount} label="Notifications" onClick={() => setShowNotifications(!showNotifications)} />
            {showNotifications && (
              <div style={{
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
              }}>
                <p style={{ padding: "16px", fontSize: "0.9rem", color: "#666" }}>No new notifications</p>
              </div>
            )}
          </div>
          <NavIcon icon={MessageCircle} badge={chatUnreadCount} label="Chat" />
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(255,255,255,0.15)",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            paddingTop: "0.4rem",
            paddingBottom: "0.4rem",
            borderRadius: "20px",
            marginLeft: "0.5rem",
          }}>
            {/* <Trophy size={18} color="#fff9c4" />
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{points}</span> */}
          </div>
          <div style={{ position: "relative" }}>
            <NavIcon icon={User} label="Profile" onClick={() => setShowProfile(!showProfile)} />
            {showProfile && (
              <div style={{
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
              }}>
                <div style={{ padding: "12px 16px", backgroundColor: "#f0f8f5", borderBottom: "1px solid #eee", fontWeight: "600", fontSize: "0.95rem", color: "#263238" }}>My Account</div>
                <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s", borderBottom: "1px solid #eee" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}><User size={16} /> Profile</Link>
                <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s", borderBottom: "1px solid #eee" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}><Settings size={16} /> Settings</Link>
                <Link to="/addresses" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s", borderBottom: "1px solid #eee" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}><MapPin size={16} /> Addresses</Link>
                <Link to="/rewards" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s", borderBottom: "1px solid #eee" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}><Trophy size={16} /> My Points</Link>
                <Link to="/help" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", textDecoration: "none", color: "#263238", fontSize: "0.9rem", transition: "background 0.2s", borderBottom: "1px solid #eee" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}><HelpCircle size={16} /> Help</Link>
                <button onClick={logout} style={{
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
                }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ffebee"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff3e0"}>
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

export default BuyerNavbar;
