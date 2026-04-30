import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [items, setItems] = useState([{id: 1, name: 'Apples', quantity: 5}]); // Default test data

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{color: '#2ecc71'}}>🌿 Your Pantry Inventory</h1>
      <table border="1" style={{ width: '80%', margin: 'auto', borderCollapse: 'collapse' }}>
        <thead style={{backgroundColor: '#2ecc71', color: 'white'}}>
          <tr><th>Item Name</th><th>Quantity</th></tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}