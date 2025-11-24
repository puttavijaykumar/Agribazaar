import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import EnhancedFooter from "../components/EnhancedFooter";
import BuyerNavbar from "../components/BuyerNavbar";

const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const FertilizersPage = () => {
  const [products, setProducts] = useState([]);
  const [navbarUser, setNavbarUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setNavbarUser(JSON.parse(storedUser));
  }, []);
  
  useEffect(() => {
    AuthService.fetchAdminProducts("Fertilizers")
      .then(res => {
        setProducts(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <BuyerNavbar user={navbarUser || {}} />
      
      <main style={{ flex: 1, padding: "clamp(1rem, 3vw, 2rem)", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "clamp(1.5rem, 4vw, 2rem)" }}>
          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            color: "#1a1a1a",
            margin: "0 0 0.25rem 0",
            fontWeight: "600"
          }}>
            Fertilizers
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e8e8e8",
              borderTop: "3px solid #27ae60",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }}></div>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>Loading fertilizers...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "clamp(2rem, 5vw, 3rem)",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #ddd"
          }}>
            <p style={{ fontSize: "1rem", color: "#666", margin: 0 }}>
              No fertilizers available right now.
            </p>
          </div>
        ) : (
          /* Products Grid - Compact Style */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px, 100%, 200px), 1fr))",
            gap: "clamp(0.75rem, 2vw, 1rem)",
            marginBottom: "2rem"
          }}>
            {products.map(product => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "clamp(0.6rem, 2vw, 0.8rem)",
                  background: "#fff",
                  boxShadow: hoveredId === product.id 
                    ? "0 4px 12px rgba(0, 0, 0, 0.1)" 
                    : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Image Container */}
                <div style={{
                  overflow: "hidden",
                  borderRadius: "4px",
                  marginBottom: "clamp(0.5rem, 2vw, 0.6rem)",
                  height: "clamp(100px, 20vw, 140px)",
                  background: "#f9f9f9",
                  position: "relative"
                }}>
                  <img
                    src={product.image1 ? `${IMAGE_BASE_URL}${product.image1}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="140"%3E%3Crect fill="%23f0f0f0" width="200" height="140"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="12"%3EImage%3C/text%3E%3C/svg%3E'}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>

                {/* Product Name */}
                <h3 style={{
                  margin: "0 0 clamp(0.3rem, 1vw, 0.4rem) 0",
                  fontSize: "clamp(0.8rem, 1.8vw, 0.95rem)",
                  color: "#1a1a1a",
                  fontWeight: "500",
                  lineHeight: "1.3",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {product.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                  color: "#888",
                  margin: "0 0 clamp(0.3rem, 1vw, 0.4rem) 0",
                  lineHeight: "1.2",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {product.description}
                </p>

                {/* Price & Button Container */}
                <div style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "clamp(0.4rem, 1vw, 0.6rem)",
                  paddingTop: "clamp(0.5rem, 1vw, 0.6rem)"
                }}>
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                      color: "#1a1a1a",
                      fontWeight: "600"
                    }}>
                      ₹{product.price}
                    </p>
                  </div>
                  
                  <button style={{
                    padding: "clamp(0.35rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 1rem)",
                    background: "#27ae60",
                    color: "#fff",
                    border: "1px solid #27ae60",
                    borderRadius: "4px",
                    fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    flex: "0 0 auto"
                  }}>
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          main {
            padding: 0.75rem;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          div {
            --grid-cols: repeat(auto-fill, minmax(160px, 1fr));
          }
        }

        @media (min-width: 1400px) {
          main {
            padding: 2rem;
          }
        }
      `}</style>

      <EnhancedFooter />
    </div>
  );
};

export default FertilizersPage;