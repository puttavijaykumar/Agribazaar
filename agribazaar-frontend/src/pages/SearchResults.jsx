import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate  } from 'react-router-dom';
import AuthService from '../services/AuthService';
import BuyerNavbar from '../components/BuyerNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

// Set this to your Cloudinary upload folder:
const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();      // add this line
  const query = searchParams.get('query') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const results = await AuthService.searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Error fetching search results', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading)
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <BuyerNavbar />

      {/* Main content */}
      <main
        style={{
          flex: '1 0 auto',
          padding: '1rem',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h2 style={{ marginBottom: '2rem', marginLeft: '0.5rem' }}>
          Results for "{query}"
        </h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              width: '100%',
              margin: '0 auto',
              alignItems: 'stretch',
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/farmer/${product.id}`)}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '0.5rem 0.5rem 1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '260px',
                  margin: '0 auto',
                }}
              >
                <img
                  src={product.image1 ? `${IMAGE_BASE_URL}${product.image1}` : ''}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '0.7rem',
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h4 style={{ margin: '0.5rem 0 0.2rem', fontSize: '1.09rem', fontWeight: 700 }}>
                  {product.name}
                </h4>
                <p style={{ margin: 0, color: '#444', fontWeight: 600 }}>
                  ₹{product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* Footer */}
      <EnhancedFooter />
    </div>
  );
};

export default SearchResults;
