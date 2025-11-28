// src/components/HomeNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Search,
} from "lucide-react";
import "./HomeNavbar.css";

const HomeNavbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loggedIn = !!user;
  const isFarmer = user?.role === "farmer";
  const isBuyer = user?.role === "buyer";
  const isBoth = user?.role === "both";

  const isHomePage = location.pathname === "/";

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

  /* ========== MOBILE SWITCH BUTTON (Home only) ========== */
  const renderMobileSwitch = () => {
    if (!loggedIn || isBoth) return null;

    if (isFarmer && isHomePage) {
      return (
        <button
          className="mobile-switch-btn"
          onClick={() => navigate("/farmer/dashboard")}
        >
          Farmer
        </button>
      );
    }

    if (isBuyer && isHomePage) {
      return (
        <button
          className="mobile-switch-btn"
          onClick={() => navigate("/buyer/dashboard")}
        >
          Buyer
        </button>
      );
    }

    return null;
  };

  return (
    <>
      {/* =====================================================
           ⭐ MOBILE TOP BAR (Only on phones)
           Categories | Search | Switch | Menu
         ===================================================== */}
      <div className="mobile-top-row">
        <button
          className="mobile-cat-btn"
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
        >
          Categories
        </button>

        <form className="mobile-search-form" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <Search size={18} />
          </button>
        </form>

        {renderMobileSwitch()}

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* =====================================================
           ⭐ DESKTOP NAVBAR (unchanged layout, except icons moved here)
         ===================================================== */}
      <nav className="nav-root">
        {/* ---------- LEFT (Logo) ---------- */}
        <div className="navbar-left">
          <div
            className="desktop-logo"
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.2rem,4vw,1.8rem)",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={() => navigate("/")}
          >
            <Leaf size={24} color="#aed581" style={{ marginRight: 6 }} />
            AgriBazaar
          </div>
        </div>

        {/* ---------- CENTER NAV (Categories + Search + Icons) ---------- */}
        <div className="desktop-nav">
          {/* Categories */}
          <div className="desktop-cat-wrapper">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="desktop-cat-btn"
            >
              Categories ▾
            </button>

            {showCategoryMenu && (
              <div className="desktop-cat-dropdown">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="cat-item"
                    onClick={() => {
                      navigate(`/search?query=${cat}`);
                      setShowCategoryMenu(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form className="desktop-search-form" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {/* ---------- DESKTOP ICONS (only one block) ---------- */}
          <div className="desktop-icons">
            {isBuyer && (
              <>
                <Link to="/cart" className="icon-btn">
                  <ShoppingCart size={20} />
                </Link>

                <Link to="/buyer/wishlist" className="icon-btn">
                  <Heart size={20} />
                </Link>

                <Link to="/orders" className="icon-btn">
                  <Package size={20} />
                </Link>
              </>
            )}

            {!isFarmer && loggedIn && (
              <Link to="/register" className="seller-btn">
                <UserCheck size={16} /> Seller
              </Link>
            )}

            {isBoth && (
              <div className="switch-wrapper">
                <button
                  className="switch-btn"
                  onClick={() =>
                    setShowDashboardDropdown(!showDashboardDropdown)
                  }
                >
                  Switch ▼
                </button>

                {showDashboardDropdown && (
                  <div className="switch-dropdown">
                    <div
                      className="switch-item"
                      onClick={() => navigate("/farmer/dashboard")}
                    >
                      <Tractor size={16} /> Farmer
                    </div>

                    <div
                      className="switch-item"
                      onClick={() => navigate("/buyer/dashboard")}
                    >
                      <ShoppingCart size={16} /> Buyer
                    </div>
                  </div>
                )}
              </div>
            )}

            {loggedIn ? (
              <div className="profile-wrapper">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <User size={18} />
                </button>

                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="profile-name">
                      {user?.username || user?.email}
                    </div>

                    <Link
                      to="/profile"
                      className="profile-item"
                      onClick={() => setShowProfile(false)}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <button
                      className="profile-item logout-btn"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="auth-btn">
                  <LogIn size={18} /> Login
                </Link>

                <Link to="/register" className="auth-btn">
                  <UserPlus size={18} /> Sign Up
                </Link>
              </>
            )}

            <button className="dark-btn">
              <Sun size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================
           ⭐ MOBILE SLIDE MENU (unchanged)
         ===================================================== */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <form className="mobile-search-mini" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div>
            <button
              className="mobile-cat-expand"
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            >
              Categories ▾
            </button>

            {showCategoryMenu && (
              <div className="mobile-cat-dropdown">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="mobile-cat-item"
                    onClick={() => {
                      navigate(`/search?query=${cat}`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {loggedIn ? (
            <>
              <Link to="/cart" className="mobile-link">
                <ShoppingCart size={20} /> Cart
              </Link>

              <Link to="/buyer/wishlist" className="mobile-link">
                <Heart size={20} /> Wishlist
              </Link>

              <Link to="/orders" className="mobile-link">
                <Package size={20} /> Orders
              </Link>

              <Link to="/profile" className="mobile-link">
                <User size={20} /> Profile
              </Link>

              <button className="mobile-link" onClick={handleLogout}>
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">
                <LogIn size={20} /> Login
              </Link>
              <Link to="/register" className="mobile-link">
                <UserPlus size={20} /> Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </>
  );
};

/* =====================================================
   EXPORT
   ===================================================== */
export default HomeNavbar;
