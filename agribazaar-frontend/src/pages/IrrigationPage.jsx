import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import EnhancedFooter from "../components/EnhancedFooter";
import BuyerNavbar from "../components/BuyerNavbar";

const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const IrrigationPage = () => {
  const [products, setProducts] = useState([]);
  const [navbarUser, setNavbarUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setNavbarUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    AuthService.fetchAdminProducts("Irrigation")
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
    <div style={{ minHeight: "100vh", background: "#f9fdfb", paddingBottom: "2rem" }}>
      <BuyerNavbar user={navbarUser || {}} />
    <div style={{ padding: '2rem' }}>
      <h1>Irrigation</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No irrigation products available right now.</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {products.map(product => (
            <div key={product.id} style={{
              border: '1px solid #eee',
              padding: '1rem',
              borderRadius: '8px',
              width: '200px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <img
                src={product.image1 ? `${IMAGE_BASE_URL}${product.image1}` : ''}
                alt={product.name}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <h4 style={{ margin: '0.5rem 0' }}>{product.name}</h4>
              <p style={{ margin: 0 }}>₹{product.price}</p>
              <p style={{ fontSize: "0.85rem", color: "#555" }}>{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    <EnhancedFooter />
  </div>
  );
};

export default IrrigationPage;
