// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import StudentSearch from './pages/StudentSearch';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/layout/Sidebar';
import AdminUpload from './pages/AdminUpload';
import ManageBranches from './pages/ManageBranches'; // Import ManageBranches
import Navbar from './components/navbar/Navbar'; // <-- IMPORT NEW NAVBAR

import './App.css';
import './components/layout/Sidebar.css';
import './components/navbar/Navbar.css'; // <-- IMPORT NAVBAR CSS

// This layout now includes the Navbar
function AppLayout({ userRole, onLogout }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar 
        onLogout={onLogout} 
        onMenuClick={() => setIsSidebarOpen(true)} // <-- Pass toggle
      />
      <div className="app-layout">
        {/* Pass state and close function to sidebar */}
        <Sidebar 
          userRole={userRole} 
          isActive={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        {/* This overlay closes the sidebar when clicked */}
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <main className="main-content">
          <Routes>
            {userRole === 'admin' ? (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/upload" element={<AdminUpload />} />
                <Route path="/admin/branches" element={<ManageBranches />} /> {/* Your new route */}
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<StudentSearch />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

  const handleLoginSuccess = (role) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!userRole ? (
          <>
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        ) : (
          // The onLogout prop is now passed from App to AppLayout
          <Route path="/*" element={<AppLayout userRole={userRole} onLogout={handleLogout} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;