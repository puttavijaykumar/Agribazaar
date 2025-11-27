import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const livePricesStyle = (colors) => ({
  backgroundColor: colors.harvestYellow,  // light yellow background for the entire container
  color: colors.primaryGreen,
  padding: "1rem 2rem",
  display: "flex",
  gap: "1rem",
  overflowX: "auto",
  overflowY: "hidden",
  fontWeight: "600",
  borderRadius: "12px",
  margin: "1rem 2rem",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
  paddingRight: "3rem",
  // Added white-space nowrap so contents won't wrap vertically
  whiteSpace: "nowrap",
});

const priceItemStyle = {
  flexShrink: 0,
  cursor: "pointer",
  backgroundColor: "#fff9db",  // lighter yellow shade for individual price box
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
  userSelect: "none",
  display: "inline-block",
  color: "inherit",
  textDecoration: "none",  // no underline
};

const LiveMarketPricesSection = ({ colors }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    AuthService.fetchLiveMarketPrices()
      .then((data) => {
        setMarketData(data.records || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load live market prices.");
        setLoading(false);
      });
  }, []);

  const getMarketUrl = (marketName) => {
    if (!marketName) return "#";
    return `https://www.google.com/search?q=${encodeURIComponent(marketName + " market")}`;
  };

  if (loading)
    return <p style={{ color: colors.primaryGreen, margin: "1rem 2rem" }}>Loading live market prices...</p>;
  if (error)
    return <p style={{ color: "crimson", margin: "1rem 2rem" }}>{error}</p>;
  if (marketData.length === 0)
    return <p style={{ color: "#666", margin: "1rem 2rem" }}>No live market price data available.</p>;

  return (
    <section style={livePricesStyle(colors)}>
      {marketData.map(({ commodity, modal_price, market, arrival_date }, idx) => (
        <a
          key={idx}
          href={getMarketUrl(market)}
          target="_blank"
          rel="noopener noreferrer"
          style={priceItemStyle}
          title={`${commodity} - Market: ${market} - Arrival Date: ${arrival_date}`}
        >
          {commodity} ({market}) ₹{modal_price}
        </a>
      ))}
    </section>
  );
};

export default LiveMarketPricesSection;
