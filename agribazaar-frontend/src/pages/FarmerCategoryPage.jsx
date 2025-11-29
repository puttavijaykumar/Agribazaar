import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BuyerNavbar from "../components/BuyerNavbar";
import EnhancedFooter from "../components/EnhancedFooter";

const IMAGE_BASE_URL = "https://res.cloudinary.com/dpiogqjk4/";

const FarmerCategoryPage = () => {
  const { category } = useParams(); // e.g. "Spices"
  const navigate = useNavigate();

  const [navbarUser, setNavbarUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load navbar user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setNavbarUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }, []);

  // Load farmer products for this category
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AuthService.fetchFarmerProductsByCategory(category);
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching farmer category products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const niceTitle = category;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
      }}
    >
      <BuyerNavbar user={navbarUser || {}} />

      <main
        style={{
          flex: 1,
          padding: "clamp(1rem, 3vw, 2rem)",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            color: "#1a1a1a",
            margin: "0 0 1rem 0",
            fontWeight: "600",
          }}
        >
          {niceTitle} from Farmers
        </h1>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "6px",
              marginBottom: "1rem",
              border: "1px solid #f5c6cb",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #e8e8e8",
                borderTop: "3px solid #2d6a4f",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            ></div>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              Loading {niceTitle.toLowerCase()}...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(2rem, 5vw, 3rem)",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
                margin: 0,
              }}
            >
              No products available in this category yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(clamp(200px, 30vw, 260px), 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/farmer/${product.id}`)}
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  padding: "0.5rem 0.5rem 1rem 0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={
                    product.image1
                      ? `${IMAGE_BASE_URL}${product.image1}`
                      : ""
                  }
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "0.7rem",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <h4
                  style={{
                    margin: "0.5rem 0 0.2rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {product.name}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: "#444",
                    fontWeight: 600,
                  }}
                >
                  ₹{product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <EnhancedFooter />
    </div>
  );
};

export default FarmerCategoryPage;
