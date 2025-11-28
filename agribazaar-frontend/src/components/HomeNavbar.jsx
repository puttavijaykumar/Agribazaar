// src/components/HomeNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Heart, User, LogOut, LogIn, UserPlus, Sun, Leaf, UserCheck, Package, Tractor, Menu, X
} from "lucide-react";

const HomeNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loggedIn = !!user;
  const isFarmer = user?.role === "farmer" || user?.role === "both";
  const isBuyer = user?.role === "buyer" || user?.role === "both";
  const isBoth = user?.role === "both";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      if (isMobile) setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const categories = [
    "Grains", "Spices", "Fruits", "Vegetables", "Dairy", "Seeds", "Machinery"
  ];

  return (
    <nav
      style={{
        background: "#388e3c",
        color: "white",
        padding: "clamp(0.6rem,2vw,1rem) clamp(1rem,3vw,2rem)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Top row: logo + (desktop content) / hamburger */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "nowrap",
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontWeight: 900,
            fontSize: "clamp(1.25rem,5vw,2rem)",
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => navigate("/")}
        >
          <Leaf size={28} color="#aed581" style={{ marginRight: 6 }} />
          AgriBazaar
        </div>

        {/* Desktop content (center + right) */}
        {!isMobile && (
          <>
            {/* Categories + Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
                gap: "1rem",
                minWidth: 0,
              }}
            >
              {/* Categories dropdown */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setShowCategoryMenu((prev) => !prev)}
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginRight: 6,
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
                          navigate(`/search?query=${encodeURIComponent(cat)}`);
                        }}
                        style={{
                          padding: "10px 20px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f1f1f1",
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

              {/* Search */}
              <form
                onSubmit={handleSearch}
                style={{
                  flex: "1 1 220px",
                  maxWidth: 450,
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                }}
              >
                <input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: "20px 0 0 20px",
                    padding: "0.62rem 1.1rem",
                    fontSize: "1rem",
                    outline: "none",
                    minWidth: 0,
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
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right icons */}
            <RightActions
              loggedIn={loggedIn}
              isBuyer={isBuyer}
              isFarmer={isFarmer}
              isBoth={isBoth}
              user={user}
              handleLogout={handleLogout}
              navigate={navigate}
            />
          </>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        )}
      </div>

      {/* Mobile dropdown content */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            marginTop: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Categories */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCategoryMenu((prev) => !prev)}
              style={{
                background: "#2e7d32",
                color: "white",
                border: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                padding: "0.5rem 0.75rem",
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
                  position: "relative",
                  marginTop: 4,
                  background: "white",
                  color: "#263238",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.13)",
                  zIndex: 20,
                  fontWeight: 500,
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setShowCategoryMenu(false);
                      setMobileMenuOpen(false);
                      navigate(`/search?query=${encodeURIComponent(cat)}`);
                    }}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1",
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "20px 0 0 20px",
                padding: "0.55rem 0.9rem",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.55rem 0.9rem",
                borderRadius: "0 20px 20px 0",
                background: "#aed581",
                color: "#388e3c",
                border: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Search
            </button>
          </form>

          {/* Actions stacked */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <RightActions
              loggedIn={loggedIn}
              isBuyer={isBuyer}
              isFarmer={isFarmer}
              isBoth={isBoth}
              user={user}
              handleLogout={handleLogout}
              navigate={navigate}
              isMobile
            />
          </div>
        </div>
      )}
    </nav>
  );
};

/* Extract right-side actions into a subcomponent for reuse */
const RightActions = ({
  loggedIn,
  isBuyer,
  isFarmer,
  isBoth,
  user,
  handleLogout,
  navigate,
  isMobile = false,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        gap: isMobile ? "0.4rem" : "1rem",
        alignItems: "center",
        fontSize: "1.1rem",
        flexWrap: isMobile ? "wrap" : "nowrap",
        justifyContent: isMobile ? "flex-start" : "flex-end",
      }}
    >
      {isBuyer && (
        <>
          <Link to="/cart" style={iconLinkStyle} title="View Cart">
            <ShoppingCart size={22} />
          </Link>
          <Link to="/buyer/wishlist" style={iconLinkStyle} title="Wishlist">
            <Heart size={22} />
          </Link>
          <Link to="/orders" style={iconLinkStyle} title="Your Orders">
            <Package size={22} />
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
            padding: "0.45rem 1rem",
            marginLeft: isMobile ? 0 : 4,
          }}
        >
          <UserCheck size={18} style={{ marginRight: 5 }} /> Become a Seller
        </Link>
      )}

      {isBoth && (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDashboardDropdown((v) => !v)}
            style={{
              ...iconLinkStyle,
              background: "#f3e8fd",
              color: "#263238",
              border: "1px solid #aed581",
              fontWeight: 700,
              borderRadius: 8,
              padding: "0.41rem 1.2rem",
              minWidth: 130,
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
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => {
                  setShowDashboardDropdown(false);
                  navigate("/farmer/dashboard");
                }}
                style={menuItemStyle}
              >
                <Tractor size={18} /> Farmer
              </div>
              <div
                onClick={() => {
                  setShowDashboardDropdown(false);
                  navigate("/buyer/dashboard");
                }}
                style={menuItemStyle}
              >
                <ShoppingCart size={18} /> Buyer
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
              justifyContent: "center",
            }}
            title="Profile"
          >
            <User size={22} />
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
                boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
                zIndex: 40,
                minWidth: 170,
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid #eee",
                  fontWeight: 700,
                  padding: "14px 17px 0 17px",
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
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link to="/login" style={iconLinkStyle}>
            <LogIn size={22} style={{ marginRight: 4 }} /> Login
          </Link>
          <Link to="/register" style={iconLinkStyle}>
            <UserPlus size={22} style={{ marginRight: 4 }} /> Sign Up
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
          padding: 4,
        }}
      >
        <Sun size={20} />
      </button>
    </div>
  );
};

const iconLinkStyle = {
  color: "white",
  fontWeight: 700,
  background: "transparent",
  fontSize: "0.95rem",
  border: "none",
  outline: "none",
  cursor: "pointer",
  alignItems: "center",
  display: "inline-flex",
  gap: 3,
  textDecoration: "none",
  padding: "0.4rem",
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#263238",
  padding: "11px 17px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
};

export default HomeNavbar;
