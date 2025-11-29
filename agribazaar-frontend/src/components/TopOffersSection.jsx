import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

// Helper for safe image URLs
const getImageUrl = (img) => {
  if (!img) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="260" height="120"%3E%3Crect fill="%23f0f0f0" width="260" height="120"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  // If it's already a full URL, return it
  if (typeof img === "string" && img.startsWith("http")) {
    return img;
  }
  // Otherwise it's a relative path from Cloudinary
  return img;
};

const TopOffersSection = ({ colors }) => {

  const navigate = useNavigate();  
  const [offerProducts, setOfferProducts] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [error, setError] = useState(null);
  const [hoverOffer, setHoverOffer] = useState(null);

  useEffect(() => {
    setLoadingOffers(true);
    setError(null);
    AuthService.fetchTopOffers()
      .then((offers) => {
        console.log("Top offers fetched:", offers); // Debug: check if your new product is here
        setOfferProducts(offers || []);
        setLoadingOffers(false);
      })
      .catch((err) => {
        console.error("Error fetching top offers:", err);
        setError("Failed to load top offers. Please try again later.");
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

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: "1rem",
            margin: "0 2rem 1rem 2rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "6px",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      <section style={offersContainer}>
        {loadingOffers ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "280px",
              width: "100%",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #e8e8e8",
                borderTop: "3px solid #2e7d32",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            ></div>
            <span style={{ color: "#666", fontSize: "0.95rem" }}>
              Loading top offers...
            </span>
          </div>
        ) : offerProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              width: "100%",
              color: "#666",
            }}
          >
            No offers available right now.
          </div>
        ) : (
          offerProducts.map((offer) => {
            const {
              id,
              title,
              desc,
              img,
              discount,
              originalPrice,
              discountedPrice,
              farmer,
              location,
              stock,
            } = offer;

            return (
              <div
                key={id} // ✅ Use id instead of idx
                style={{
                  ...offerCardStyle,
                  transform: hoverOffer === id ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    hoverOffer === id
                      ? "0 8px 16px rgba(0,0,0,0.2)"
                      : "0 4px 8px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={() => setHoverOffer(id)}
                onMouseLeave={() => setHoverOffer(null)}
              >
                {/* Discount Badge */}
                {discount && discount !== "0%" && (
                  <div style={discountBadgeStyle}>{discount} OFF</div>
                )}

                {/* Image with fallback */}
                <img
                  src={getImageUrl(img)}
                  alt={title}
                  style={offerImgStyle}
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="260" height="120"%3E%3Crect fill="%23f0f0f0" width="260" height="120"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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
                    {discount && discount !== "0%" && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          textDecoration: "line-through",
                          color: "#999",
                        }}
                      >
                        ₹{originalPrice} per kg
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: colors.primaryGreen,
                      }}
                    >
                      ₹{discountedPrice} per kg
                    </span> 
                  </div>

                  {/* Farmer Info */}
                  {(farmer || location) && (
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
                      👨‍🌾 {farmer || "Farmer"} • {location || "India"}
                    </div>
                  )}

                  {/* Stock Alert */}
                  {stock > 0 && stock < 20 && (
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
                    onClick={() => navigate(`/product/admin/${id}`)}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            );
          })
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
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default TopOffersSection;
