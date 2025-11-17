import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthService from '../services/AuthService';
import BuyerNavbar from '../components/BuyerNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

// Set this to your Cloudinary upload folder:
const IMAGE_BASE_URL = 'https://res.cloudinary.com/dpiogqjk4/';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Optionally manage search query and handlers if pass to Navbar
  // const [searchQuery, setSearchQuery] = useState(query);
  // const handleSearch = ...

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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <BuyerNavbar 
        // Pass props if needed
        // searchQuery={searchQuery}
        // setSearchQuery={setSearchQuery}
        // handleSearch={handleSearch}
      />

      {/* Main content */}
      <main style={{ flex: '1 0 auto', padding: '1rem' }}>
        <h2>Results for "{query}"</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  minWidth: '200px',
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '0.5rem'
                }}
              >
                <img
                  src={
                    product.image1
                      ? `${IMAGE_BASE_URL}${product.image1}`
                      : ''
                  }
                  alt={product.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
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
