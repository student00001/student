import React from 'react';

const StudentCard = (props) => {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    width: '250px',
    boxShadow: '2px 2px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ color: '#333' }}>{props.name}</h2>
      <p><strong>Department:</strong> {props.dept}</p>
      <p><strong>Marks:</strong> {props.marks}%</p>
    </div>
  );
};

export default StudentCard;