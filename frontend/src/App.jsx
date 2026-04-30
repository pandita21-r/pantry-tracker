import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);

  // This connects to your JAVA BACKEND
  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:8080/api/pantry')
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.error("Backend not running on 8080!"));
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <div className="dashboard-container">
        <h1>🌿 Pantry Inventory</h1>
        <table>
          <thead>
            <tr><th>ID</th><th>Item Name</th><th>Quantity</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.quantity}</td></tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setIsLoggedIn(false)} className="sign-in-btn" style={{marginTop: '20px'}}>Logout</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="hero-section">
        <div className="logo">🌿 PantryTrack</div>
        <h1>Smarter kitchen.<br/>Zero food waste.</h1>
        <p>Track every item in your pantry in real time.</p>
      </div>
      <div className="form-section">
        <div className="login-box">
          <h2>Welcome back</h2>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
            <label>Email</label>
            <input type="email" placeholder="alex@example.com" required />
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
            <button type="submit" className="sign-in-btn">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}
// fd
export default App;