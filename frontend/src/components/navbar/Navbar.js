// frontend/src/components/navbar/Navbar.js
import React from 'react';
import { FaSignOutAlt, FaBars } from 'react-icons/fa'; // <-- IMPORT FaBars
import './Navbar.css';

// <-- Add onMenuClick prop
function Navbar({ onLogout, onMenuClick }) { 
  return (
    <nav className="top-navbar">
      <div className="navbar-brand">
        {/* --- ADD MENU BUTTON --- */}
        <button className="menu-toggle" onClick={onMenuClick}>
          <FaBars />
        </button>
        {/* --- END MENU BUTTON --- */}
        
        <img src="/gvp-logo.png" alt="College Logo" className="navbar-logo" />
        <h1>Gayatri Vidya Parishad College for Degree and P.G. Course (A)</h1>
      </div>
      <button onClick={onLogout} className="navbar-logout-button">
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </nav>
  );
}

export default Navbar;