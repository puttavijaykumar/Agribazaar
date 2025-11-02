import React from 'react';

const SelectDashboard = ({ onSelect }) => {
  const handleSelection = (type) => {
    onSelect(type);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: '20px', backgroundColor: '#f1f8e9', borderRadius: 8 }}>
      <h2>Select Your Dashboard</h2>
      <button onClick={() => handleSelection('farmer')} style={buttonStyle}>Farmer Dashboard</button>
      <button onClick={() => handleSelection('buyer')} style={buttonStyle}>Buyer Dashboard</button>
      <button onClick={() => handleSelection('both')} style={buttonStyle}>Both Roles</button>
    </div>
  );
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  backgroundColor: '#388e3c',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer'
};

export default SelectDashboard;
