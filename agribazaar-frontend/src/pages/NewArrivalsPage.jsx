// src/pages/NewArrivalsPage.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const NewArrivalsPage = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await AuthService.fetchNewArrivals();
        setNewArrivals(data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <div>
      <h1>New Arrivals</h1>
      {newArrivals.length === 0 ? <p>No new arrivals yet.</p> : (
        <ul>
          {newArrivals.map(item => (
            <li key={item.id}>{item.name} - ₹{item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewArrivalsPage;
