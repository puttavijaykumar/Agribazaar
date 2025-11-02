import React from 'react';

const CombinedDashboard = () => {
  return (
    <div style={dashboardStyle}>
      <h2>Combined Farmer & Buyer Dashboard</h2>
      {/* Your combined features go here */}
      <p>Manage products and browse marketplace.</p>
    </div>
  );
};

const dashboardStyle = {
  padding: 20,
  maxWidth: 900,
  margin: '20px auto',
  backgroundColor: '#ffe0b2',
  borderRadius: 8
};

export default CombinedDashboard;
