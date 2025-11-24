import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import EnhancedFooter from "../components/EnhancedFooter";
import BuyerNavbar from "../components/BuyerNavbar";

const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const SeedsPage = () => {
  const [products, setProducts] = useState([]);
  const [navbarUser, setNavbarUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setNavbarUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    AuthService.fetchAdminProducts("Seeds")
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f9fdfb 0%, #f0f8f4 100%)", display: "flex", flexDirection: "column" }}>
      <BuyerNavbar user={navbarUser || {}} />
      
      <main style={{ flex: 1, padding: "clamp(1rem, 5vw, 2rem)" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "clamp(1.5rem, 5vw, 3rem)" }}>
          <h1 style={{
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            color: "#1a472a",
            margin: "0 0 0.5rem 0",
            fontWeight: "700",
            letterSpacing: "-0.5px"
          }}>
            🌱 Premium Seeds Collection
          </h1>
          <p style={{
            color: "#666",
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            margin: 0
          }}>
            Discover our hand-picked selection of quality seeds
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: "4px solid #e8f5e9",
              borderTop: "4px solid #2d6a4f",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }}></div>
            <p style={{ color: "#666", fontSize: "1rem" }}>Loading premium seeds...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "clamp(2rem, 5vw, 4rem)",
            background: "#fff",
            borderRadius: "12px",
            border: "2px dashed #2d6a4f"
          }}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#666" }}>
              🌾 No seeds available right now. Check back soon!
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(160px, 100%, 280px), 1fr))",
            gap: "clamp(1rem, 3vw, 1.5rem)",
            marginBottom: "2rem"
          }}>
            {products.map(product => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "clamp(0.75rem, 3vw, 1rem)",
                  background: "#fff",
                  boxShadow: hoveredId === product.id 
                    ? "0 8px 24px rgba(45, 106, 79, 0.15)" 
                    : "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: hoveredId === product.id ? "translateY(-4px)" : "translateY(0)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}
              >
                {/* Image Container */}
                <div style={{
                  overflow: "hidden",
                  borderRadius: "8px",
                  marginBottom: "clamp(0.5rem, 2vw, 0.75rem)",
                  height: "clamp(120px, 25vw, 180px)",
                  background: "#f5f5f5"
                }}>
                  <img
                    src={product.image1 ? `${IMAGE_BASE_URL}${product.image1}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="180"%3E%3Crect fill="%23f0f0f0" width="200" height="180"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{
                    margin: "0 0 clamp(0.25rem, 2vw, 0.5rem) 0",
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    color: "#1a472a",
                    fontWeight: "600",
                    lineHeight: "1.3",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
                    color: "#999",
                    margin: "0 0 clamp(0.25rem, 2vw, 0.5rem) 0",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: 1
                  }}>
                    {product.description}
                  </p>

                  {/* Price */}
                  <div style={{
                    marginTop: "auto",
                    paddingTop: "clamp(0.5rem, 2vw, 0.75rem)",
                    borderTop: "1px solid #f0f0f0"
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                      color: "#2d6a4f",
                      fontWeight: "700"
                    }}>
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button style={{
                  marginTop: "clamp(0.5rem, 2vw, 0.75rem)",
                  padding: "clamp(0.5rem, 2vw, 0.75rem)",
                  background: hoveredId === product.id ? "#2d6a4f" : "#40916c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  opacity: hoveredId === product.id ? 1 : 0.9
                }}>
                  Add to Cart
                </button>
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
            padding: 1rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          div[role="main"] {
            padding: 1.5rem;
          }
        }
      `}</style>

      <EnhancedFooter />
    </div>
  );
}

export default SeedsPage;