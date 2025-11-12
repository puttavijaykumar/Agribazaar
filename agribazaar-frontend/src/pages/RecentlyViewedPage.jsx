// src/pages/RecentlyViewedPage.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const RecentlyViewedPage = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        try {
          const data = await AuthService.fetchRecentlyViewed(user.id);
          setRecentlyViewed(data);
        } catch (error) {
          console.error("Failed to fetch recently viewed:", error);
        }
      }
    };
    fetchRecentlyViewed();
  }, []);
  return (
    <div>
      <h1>Recently Viewed</h1>
      {recentlyViewed.length === 0 ? <p>You haven't viewed any products recently.</p> : (
        <ul>
          {recentlyViewed.map(item => (
            <li key={item.id}>{item.name} - ₹{item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentlyViewedPage;