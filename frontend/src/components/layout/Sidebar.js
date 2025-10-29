// frontend/src/components/layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Removed useNavigate
import { FaSearch, FaUpload, FaTachometerAlt, FaSitemap, FaTimes } from 'react-icons/fa'; // Removed FaSignOutAlt
import './Sidebar.css';

// Admin links (unchanged)
const adminNavLinks = [
  { icon: <FaTachometerAlt />, name: 'Dashboard', path: '/admin/dashboard' },
  { icon: <FaUpload />, name: 'Upload Paper', path: '/admin/upload' },
  { icon: <FaSitemap />, name: 'Manage Branches', path: '/admin/branches' },
];

// Student links (unchanged)
const studentNavLinks = [
  { icon: <FaSearch />, name: 'Search Papers', path: '/' },
];

// onLogout prop is no longer needed here
function Sidebar({ userRole, isActive, onClose }) {
  const links = userRole === 'admin' ? adminNavLinks : studentNavLinks;

  return (
    // <-- Add 'active' class based on prop
    <div className={`sidebar ${isActive ? 'active' : ''}`}>
      {/* --- ADD MOBILE CLOSE BUTTON --- */}
      <button className="menu-toggle sidebar-close" onClick={onClose}>
        <FaTimes />
      </button>
      {/* --- END MOBILE CLOSE BUTTON --- */}

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            // Add onClick={onClose} to close menu on navigation
            onClick={onClose} 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;