// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StudentSearch from './pages/StudentSearch';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <nav className="main-nav">
                    <Link to="/">Student Search</Link>
                    <Link to="/admin">Admin Panel</Link>
                </nav>

                {/* Define the pages */}
                <Routes>
                    <Route path="/" element={<StudentSearch />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;