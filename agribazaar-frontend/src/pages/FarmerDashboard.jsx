import React from 'react';

const FarmerDashboard = () => {
  return (
    <div style={dashboardStyle}>
      <h2>Farmer Dashboard</h2>
      {/* Add your farmer-specific features here */}
      <p>Welcome to your farm management panel.</p>
    </div>
  );
};

const dashboardStyle = {
  padding: 20,
  maxWidth: 800,
  margin: '20px auto',
  backgroundColor: '#e0f2f1',
  borderRadius: 8
};

export default FarmerDashboard;
