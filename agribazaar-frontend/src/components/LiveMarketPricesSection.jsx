import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const livePricesStyle = (colors) => ({
  backgroundColor: colors.harvestYellow,
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
  whiteSpace: "nowrap",
  animation: "scroll 30s linear infinite",
});

const priceItemStyle = {
  flexShrink: 0,
  cursor: "pointer",
  backgroundColor: "#fff9db",
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
  userSelect: "none",
  display: "inline-block",
  color: "inherit",
  textDecoration: "none",
};

const LiveMarketPricesSection = ({ colors = { harvestYellow: "#fff8dc", primaryGreen: "#228b22" } }) => {
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
    <>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 1rem));
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          [data-scroll-container] {
            animation: none !important;
          }
        }
      `}</style>
      <section style={livePricesStyle(colors)} data-scroll-container>
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
    </>
  );
};

export default LiveMarketPricesSection;