import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const TopOffersSection = ({ colors }) => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [hoverOffer, setHoverOffer] = useState(null);

  useEffect(() => {
    AuthService.fetchTopOffers()
      .then((offers) => {
        setOfferProducts(offers);
        setLoadingOffers(false);
      })
      .catch((err) => {
        console.error("Error fetching top offers:", err);
        setLoadingOffers(false);
      });
  }, []);

  const offersContainer = {
    display: "flex",
    gap: "1rem",
    overflowX: "auto",
    padding: "1rem 2rem",
    margin: "1rem 0",
    overflowY: "hidden",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
    paddingRight: "3rem",
  };

  const offerCardStyle = {
    flex: "1 1 220px",
    maxWidth: "260px",
    minHeight: "280px",
    backgroundColor: "#f1f8e9",
    color: "#263238",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    flexShrink: 0,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  };

  const offerImgStyle = {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  };

  const discountBadgeStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#c62828",
    color: "white",
    padding: "6px 12px",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    zIndex: 10,
  };

  const shopButtonStyle = {
    width: "100%",
    padding: "0.6rem",
    background: colors.primaryGreen,
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "0.75rem",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <h2
        style={{
          fontSize: "clamp(1.3rem, 5vw, 2rem)",
          fontWeight: "800",
          textAlign: "left",
          marginLeft: "2rem",
          marginBottom: "16px",
          color: colors.primaryGreen,
          marginTop: "2rem",
        }}
      >
        Top Offers
      </h2>

      <section style={offersContainer}>
        {loadingOffers ? (
          <span>Loading top offers...</span>
        ) : offerProducts.length === 0 ? (
          <span>No offers available right now.</span>
        ) : (
          offerProducts.map(
            ({ title, desc, img, discount, originalPrice, discountedPrice, farmer, location, stock }, idx) => (
              <div
                key={idx}
                style={{
                  ...offerCardStyle,
                  transform: hoverOffer === idx ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    hoverOffer === idx
                      ? "0 8px 16px rgba(0,0,0,0.2)"
                      : "0 4px 8px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={() => setHoverOffer(idx)}
                onMouseLeave={() => setHoverOffer(null)}
              >
                {/* Discount Badge */}
                {discount !== "0%" && <div style={discountBadgeStyle}>{discount} OFF</div>}

                {/* Image */}
                <img src={img} alt={title} style={offerImgStyle} />

                {/* Content */}
                <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      margin: "0.5rem 0 0.3rem",
                      fontWeight: "700",
                      color: "#263238",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      margin: "0 0 0.5rem 0",
                      color: "#666",
                      flex: 1,
                    }}
                  >
                    {desc}
                  </p>

                  {/* Pricing */}
                  <div
                    style={{
                      margin: "0.5rem 0",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        textDecoration: "line-through",
                        color: "#999",
                      }}
                    >
                      ₹{originalPrice}
                    </span>
                    <span
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: colors.primaryGreen,
                      }}
                    >
                      ₹{discountedPrice}
                    </span>
                  </div>

                  {/* Farmer Info */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#666",
                      padding: "0.5rem 0",
                      borderTop: "1px solid #ddd",
                      paddingTop: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    👨‍🌾 {farmer} • {location}
                  </div>

                  {/* Stock Alert */}
                  {stock < 20 && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#d97706",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      ⚡ Only {stock} items left
                    </div>
                  )}

                  {/* Shop Button */}
                  <button
                    style={shopButtonStyle}
                    onMouseEnter={(e) =>
                      (e.target.style.background = colors.secondaryGreen)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = colors.primaryGreen)
                    }
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            )
          )
        )}
      </section>

      <style>{`
        /* Hide scrollbar but keep scrolling */
        section::-webkit-scrollbar {
          display: none;
        }
        section {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default TopOffersSection;
