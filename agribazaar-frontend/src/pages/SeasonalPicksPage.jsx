// src/pages/SeasonalPicksPage.jsx
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const SeasonalPicksPage = () => {
  const [seasonalPicks, setSeasonalPicks] = useState([]);
  useEffect(() => {
    const fetchSeasonalPicks = async () => {
      try {
        const data = await AuthService.fetchSeasonalPicks();
        setSeasonalPicks(data);
      } catch (error) {
        console.error("Failed to fetch seasonal picks:", error);
      }
    };
    fetchSeasonalPicks();
  }, []);
  return (
    <div>
      <h1>Seasonal Picks</h1>
      {seasonalPicks.length === 0 ? <p>No seasonal picks available currently.</p> : (
        <ul>
          {seasonalPicks.map(item => (
            <li key={item.id}>{item.name} - ₹{item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeasonalPicksPage;