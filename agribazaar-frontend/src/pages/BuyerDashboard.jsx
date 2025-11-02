import React from 'react';

const BuyerDashboard = () => {
  return (
    <div style={dashboardStyle}>
      <h2>Buyer Dashboard</h2>
      {/* Add your buyer-specific features here */}
      <p>Browse, search, and purchase products.</p>
    </div>
  );
};

const dashboardStyle = {
  padding: 20,
  maxWidth: 800,
  margin: '20px auto',
  backgroundColor: '#fff9c4',
  borderRadius: 8
};

export default BuyerDashboard;
