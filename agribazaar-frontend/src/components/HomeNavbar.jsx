// src/components/HomeNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Leaf,
  UserCheck,
  Package,
  Tractor,
  Menu,
  X,
} from "lucide-react";
import "./HomeNavbar.css";

const HomeNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loggedIn = !!user;
  const isFarmer = user?.role === "farmer" || user?.role === "both";
  const isBuyer = user?.role === "buyer" || user?.role === "both";
  const isBoth = user?.role === "both";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const categories = [
    "Grains",
    "Spices",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Seeds",
    "Machinery",
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav
        className="nav-root"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Left: Brand + Mobile Menu Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.2rem,4vw,1.8rem)",
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}
          >
            <Leaf
              size={24}
              color="#aed581"
              style={{ marginRight: 6, minWidth: 24 }}
            />
            <span style={{ display: "block" }}>AgriBazaar</span>
          </div>
        </div>

        {/* Desktop: Categories + Search */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Categories Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCategoryMenu((prev) => !prev)}
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
              }}
            >
              Categories ▾
            </button>
            {showCategoryMenu && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "110%",
                  background: "white",
                  color: "#263238",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.13)",
                  minWidth: 150,
                  zIndex: 20,
                  fontWeight: 500,
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setShowCategoryMenu(false);
                      navigate(
                        `/farmer-category/${encodeURIComponent(cat)}`
                      );
                    }}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f7fef7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
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
              flex: "1 0 200px",
              maxWidth: 400,
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "20px 0 0 20px",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0 20px 20px 0",
                background: "#aed581",
                color: "#388e3c",
                border: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Desktop: Right Icons */}
        <div
          className="desktop-icons"
          style={{

            display: "flex",
            gap: "0.8rem",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          {isBuyer && (
            <>
              <Link to="/cart" style={iconLinkStyle} title="View Cart">
                <ShoppingCart size={20} />
              </Link>
              <Link
                to="/buyer/wishlist"
                style={iconLinkStyle}
                title="Wishlist"
              >
                <Heart size={20} />
              </Link>
              <Link to="/orders" style={iconLinkStyle} title="Your Orders">
                <Package size={20} />
              </Link>
            </>
          )}

          {!isFarmer && (
            <Link
              to="/register"
              style={{
                ...iconLinkStyle,
                fontWeight: "bold",
                color: "#aed581",
                background: "#263238",
                borderRadius: 8,
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
              }}
            >
              <UserCheck size={16} style={{ marginRight: 4 }} /> Seller
            </Link>
          )}

          {isBoth && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setShowDashboardDropdown((v) => !v)
                }
                style={{
                  ...iconLinkStyle,
                  background: "#f3e8fd",
                  color: "#263238",
                  border: "1px solid #aed581",
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: "0.35rem 0.9rem",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                }}
              >
                Switch ▼
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
                    boxShadow:
                      "0 4px 18px rgba(102, 187, 106, 0.13)",
                    zIndex: 50,
                    minWidth: "150px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    onClick={() => {
                      setShowDashboardDropdown(false);
                      navigate("/farmer/dashboard");
                    }}
                    style={{ ...menuItemStyle }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f1f8e9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    <Tractor size={16} /> Farmer
                  </div>
                  <div
                    onClick={() => {
                      setShowDashboardDropdown(false);
                      navigate("/buyer/dashboard");
                    }}
                    style={{
                      ...menuItemStyle,
                      borderBottom: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e3f2fd")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    <ShoppingCart size={16} /> Buyer
                  </div>
                </div>
              )}
            </div>
          )}

          {loggedIn ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowProfile((v) => !v)}
                style={{
                  ...iconLinkStyle,
                  fontWeight: 900,
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  background: "#1b5e20",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                title="Profile"
              >
                <User size={18} />
              </button>
              {showProfile && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    background: "#fff",
                    color: "#263238",
                    borderRadius: 10,
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.13)",
                    zIndex: 40,
                    minWidth: 160,
                  }}
                >
                  <div
                    style={{
                      borderBottom: "1px solid #eee",
                      fontWeight: 700,
                      padding: "12px 15px 0 15px",
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.username || user?.email}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    style={menuItemStyle}
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      ...menuItemStyle,
                      color: "#b23a48",
                      border: "none",
                      background: "none",
                      width: "100%",
                      justifyContent: "flex-start",
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  ...iconLinkStyle,
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/register"
                style={{
                  ...iconLinkStyle,
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}
              >
                <UserPlus size={18} /> Sign Up
              </Link>
            </>
          )}

          <button
            title="Coming soon: Dark mode"
            style={{
              background: "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Sun size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav"
          style={{
            background: "#388e3c",
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            position: "sticky",
            top: 56,
            zIndex: 99,
          }}
        >
          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
              gap: "0.5rem",
            }}
          >
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "15px",
                padding: "0.5rem 0.8rem",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 0.8rem",
                borderRadius: "15px",
                background: "#aed581",
                color: "#388e3c",
                border: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>

          {/* Categories */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCategoryMenu((prev) => !prev)}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                padding: "0.6rem 1rem",
                borderRadius: 8,
                width: "100%",
                textAlign: "left",
              }}
            >
              Categories ▾
            </button>
            {showCategoryMenu && (
              <div
                style={{
                  background: "white",
                  color: "#263238",
                  borderRadius: 8,
                  marginTop: "0.5rem",
                  fontWeight: 500,
                  overflow: "hidden",
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setShowCategoryMenu(false);
                      navigate(
                        `/farmer-category/${encodeURIComponent(cat)}`
                      );
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1",
                      fontSize: "0.9rem",
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 95,
          }}
        />
      )}
    </>
  );
};

// Styles
const iconLinkStyle = {
  color: "white",
  fontWeight: 700,
  background: "transparent",
  border: "none",
  outline: "none",
  cursor: "pointer",
  alignItems: "center",
  display: "inline-flex",
  gap: 4,
  textDecoration: "none",
  padding: "0.3rem",
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#263238",
  padding: "10px 15px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  textDecoration: "none",
};

const mobileLinkStyle = {
  color: "white",
  fontWeight: 600,
  fontSize: "0.95rem",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  outline: "none",
  cursor: "pointer",
  borderRadius: 8,
  padding: "0.7rem 1rem",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 8,
  textAlign: "center",
  transition: "all 0.2s",
};

export default HomeNavbar;
