import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const livePricesStyle = (colors) => ({
  backgroundColor: colors.harvestYellow,
  color: colors.primaryGreen,
  padding: "1rem 2rem",
  display: "flex",
  gap: "2rem",
  overflowX: "auto",
  overflowY: "hidden",
  fontWeight: "600",
  borderRadius: "12px",
  margin: "1rem 2rem",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
  paddingRight: "3rem",
});

const priceItemStyle = {
  flexShrink: 0,
  whiteSpace: "nowrap",
  cursor: "pointer",
  textDecoration: "underline",
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

  // Generate market URL – you can replace or improve this logic if you have exact URLs
  const getMarketUrl = (marketName) => {
    // Simple example: Convert market name to URL-friendly string and external URL
    if (!marketName) return "#";
    const slug = marketName.toLowerCase().replace(/\s+/g, "-");
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
