// src/pages/RecommendedPage.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const RecommendedPage = () => {
  const [recommended, setRecommended] = useState([]);
  useEffect(() => {
    const fetchRecommended = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        try {
          const data = await AuthService.fetchRecommended(user.id);
          setRecommended(data);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
        }
      }
    };
    fetchRecommended();
  }, []);
  return (
    <div>
      <h1>Recommended For You</h1>
      {recommended.length === 0 ? <p>No recommendations at this time.</p> : (
        <ul>
          {recommended.map(item => (
            <li key={item.id}>{item.name} - ₹{item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendedPage;