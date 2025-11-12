// src/pages/TopSellersPage.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const TopSellersPage = () => {
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const data = await AuthService.fetchTopSellers();
        setTopSellers(data);
      } catch (error) {
        console.error("Failed to fetch top sellers:", error);
      }
    };
    fetchTopSellers();
  }, []);

  return (
    <div>
      <h1>Top Sellers</h1>
      {topSellers.length === 0 ? (
        <p>No top sellers found.</p>
      ) : (
        <ul>
          {topSellers.map((seller) => (
            <li key={seller.id}>
              {seller.username} - Email: {seller.email} - Total Sold: {seller.total_quantity_sold}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopSellersPage;
