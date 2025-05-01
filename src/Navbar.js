import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="navbar hidden" id="navbar">
      <div className="logo">AI-cruiter</div>
      <div className="nav-links">
        <a href="#">Schedule</a>
        <a href="#">Applications</a>
        <a href="#">Results</a>
      </div>
      <button className="login-button">Login</button>
    </div>
  );
}

export default Navbar;