// src/components/MobileBottomNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Heart, User } from "lucide-react";
import "./MobileBottomNav.css";

const MobileBottomNav = ({ loggedIn }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="mobile-bottom-nav">
      <Link
        to="/"
        className={isActive("/") ? "bottom-item active" : "bottom-item"}
      >
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link
        to="/cart"
        className={isActive("/cart") ? "bottom-item active" : "bottom-item"}
      >
        <ShoppingCart size={20} />
        <span>Cart</span>
      </Link>

      <Link
        to="/buyer/wishlist"
        className={
          isActive("/buyer/wishlist") ? "bottom-item active" : "bottom-item"
        }
      >
        <Heart size={20} />
        <span>Wishlist</span>
      </Link>

      <Link
        to={loggedIn ? "/profile" : "/login"}
        className={
          isActive("/profile") || isActive("/login")
            ? "bottom-item active"
            : "bottom-item"
        }
      >
        <User size={20} />
        <span>{loggedIn ? "Account" : "Login"}</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
