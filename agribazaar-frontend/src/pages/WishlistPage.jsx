// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        try {
          const data = await AuthService.fetchWishlist(user.id);
          setWishlist(data);
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        }
      }
    };
    fetchWishlist();
  }, []);
  return (
    <div>
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? <p>Your wishlist is empty.</p> : (
        <ul>
          {wishlist.map(item => (
            <li key={item.id}>{item.name} - ₹{item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
