// src/components/HomeNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Heart, User, LogOut, LogIn, UserPlus, Sun, Bell, Leaf, Upload, UserCheck, Package, Tractor, ShoppingCart 
} from "lucide-react";

const HomeNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);

  // Assume user = { role: "buyer" | "farmer" | "both", username: "XYZ", ... }
  const loggedIn = !!user;
  const isFarmer = user?.role === "farmer" || user?.role === "both";
  const isBuyer = user?.role === "buyer" || user?.role === "both";
  const isBoth = user?.role === "both";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRoleSwitch = () => {
    // Example: navigate or update context to switch dashboard
    if (user?.role === "both") {
      if (window.location.pathname !== "/farmer/dashboard") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/buyer/dashboard");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Or your own AuthService.logout()
    window.location.href = "/login";
  };

  // Categories (example)
  const categories = [
    "Grains", "Spices", "Fruits", "Vegetables", "Dairy", "Seeds", "Machinery"
  ];

  return (
    <nav style={{
      background: "#388e3c",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "clamp(0.6rem,2vw,1rem) clamp(1rem,3vw,2rem)",
      boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      flexWrap: "wrap",
      gap: "1rem"
    }}>
      {/* Brand */}
      <div
        style={{
          fontWeight: 900,
          fontSize: "clamp(1.25rem,5vw,2rem)",
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => navigate("/")}
      >
        <Leaf size={28} color="#aed581" style={{ marginRight: 6 }} />
        AgriBazaar
      </div>

      {/* Categories Dropdown */}
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
            marginRight: 18,
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
                onMouseEnter={e => e.currentTarget.style.background="#f7fef7"}
                onMouseLeave={e => e.currentTarget.style.background="white"}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Central Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          flex: "1 0 220px",
          maxWidth: 450,
          margin: "0 1.5rem",
          display: "flex",
          alignItems: "center"
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
            borderRadius: "20px 0 0 20px",
            padding: "0.62rem 1.1rem",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.62rem 1.2rem",
            borderRadius: "0 20px 20px 0",
            background: "#aed581",
            color: "#388e3c",
            border: "none",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </form>

      {/* Right Side: Icon Links and Role Switcher */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          fontSize: "1.1rem"
        }}
      >
        {/* Buyer features */}
        {isBuyer && (
          <>
            <Link to="/cart" style={iconLinkStyle} title="View Cart">
              <ShoppingCart size={22} />
            </Link>
            <Link to="/wishlist" style={iconLinkStyle} title="Wishlist">
              <Heart size={22} />
            </Link>
            <Link to="/orders" style={iconLinkStyle} title="Your Orders">
              <Package  size={22} />
            </Link>
          </>
        )}

        {/* Farmer actions */}
        {isFarmer && (
          <Link to="/upload-products" style={iconLinkStyle} title="Upload Product">
            <Upload size={22} />
          </Link>
        )}

        {/* Become Seller – only for buyer or not logged in */}
        {!isFarmer && (
          <Link to="/register?as=seller" style={{
            ...iconLinkStyle,
            fontWeight: "bold",
            color: "#aed581",
            background: "#263238",
            borderRadius: 8,
            padding: "0.45rem 1rem",
            marginLeft: 4
          }}>
            <UserCheck size={18} style={{marginRight: 5}} /> Become a Seller
          </Link>
        )}

        {isBoth && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDashboardDropdown(v => !v)}
              style={{
                ...iconLinkStyle,
                background: "#f3e8fd",
                color: "#263238",
                border: "1px solid #aed581",
                fontWeight: 700,
                borderRadius: 8,
                padding: "0.41rem 1.2rem",
                minWidth: 130,
                position: "relative"
              }}
            >
              Switch Dashboards ▼
            </button>
            {showDashboardDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  background: "#fff",
                  color: "#263238",
                  borderRadius: 10,
                  boxShadow: "0 4px 18px rgba(102, 187, 106, 0.13)",
                  zIndex: 50,
                  minWidth: "170px",
                  overflow: "hidden"
                }}
              >
                <div
                  onClick={() => {
                    setShowDashboardDropdown(false);
                    navigate("/farmer/dashboard");
                  }}
                  style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f8e9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <Tractor size={18} /> Farmer Dashboard
                </div>
                <div
                  onClick={() => {
                    setShowDashboardDropdown(false);
                    navigate("/buyer/dashboard");
                  }}
                  style={{
                    padding: "12px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e3f2fd"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <ShoppingCart size={18} /> Buyer Dashboard
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile/Login/Logout */}
        {loggedIn ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfile((v) => !v)}
              style={{
                ...iconLinkStyle,
                fontWeight: 900,
                borderRadius: "50%",
                width: 36, height: 36,
                background: "#1b5e20",
                color: "#fff"
              }}
              title="Profile"
            >
              <User size={22} />
            </button>
            {showProfile && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "100%",
                background: "#fff",
                color: "#263238",
                borderRadius: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
                zIndex: 40,
                minWidth: 170
              }}>
                <div style={{
                  borderBottom: "1px solid #eee",
                  fontWeight: 700,
                  padding: "14px 17px 0 17px"
                }}>
                  {user?.username || user?.email}
                </div>
                <Link to="/profile" onClick={()=> setShowProfile(false)} style={menuItemStyle}><User size={16}/> My Profile</Link>
                <button
                  onClick={handleLogout}
                  style={{...menuItemStyle, color:"#b23a48", border:"none", background:"none", width:"100%"}}
                >
                  <LogOut size={16}/> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" style={iconLinkStyle}>
              <LogIn size={22} style={{marginRight:4}} /> Login
            </Link>
            <Link to="/register" style={iconLinkStyle}>
              <UserPlus size={22} style={{marginRight:4}} /> Sign Up
            </Link>
          </>
        )}
        {/* Example theme toggle, optional */}
        <button
          title="Coming soon: Dark mode"
          style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}
        >
          <Sun size={20} />
        </button>
      </div>
    </nav>
  );
};

// Reusable icon/button style
const iconLinkStyle = {
  color: "white",
  fontWeight: 700,
  background: "transparent",
  fontSize: "1rem",
  border: "none",
  outline: "none",
  cursor: "pointer",
  alignItems: "center",
  display: "inline-flex",
  gap: 3,
  textDecoration: "none",
  padding: "0.4rem"
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontWeight: 600,
  fontSize: "1rem",
  color: "#263238",
  padding: "11px 17px",
  borderBottom: "1px solid #eee",
  cursor: "pointer"
};

export default HomeNavbar;
