// frontend/src/pages/AuthPage.js
import React, { useState } from 'react';
import { FaUserShield, FaUser } from 'react-icons/fa'; // Removed FaCheckCircle

function AuthPage({ onLoginSuccess }) {
  const [isLoginAsAdmin, setIsLoginAsAdmin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // --- Dummy Login Logic ---
    if (isLoginAsAdmin) {
      if (email === 'admin@questionpaper.com' && password === 'admin123') {
        onLoginSuccess('admin');
      } else {
        setMessage('Invalid Admin credentials.');
        setIsError(true);
      }
    } else {
      if (email.endsWith('@gvpcdpgc.edu.in') && password) {
        onLoginSuccess('student');
      } else {
        setMessage('Invalid Student credentials.');
        setIsError(true);
      }
    }
  };

  return (
    <div className="auth-layout">
      {/* The wrapper is now just one column */}
      <div className="auth-card-wrapper">

        {/* --- Single Column for Login --- */}
        <div className="auth-right-column">
          
          {/* --- NEW HEADER --- */}
          <img src="/gvp-logo.png" alt="College Logo" className="auth-logo-top" />
          <h1 className="auth-title-top">
            Gayatri Vidya Parishad College for Degree and P.G. Courses(A)
          </h1>
          {/* --- END NEW HEADER --- */}

          <p className="description">Sign in to access the question paper archive</p>

          <div className="auth-toggle">
            <button
              className={`auth-toggle-button ${isLoginAsAdmin ? 'active' : ''}`}
              onClick={() => setIsLoginAsAdmin(true)}
            >
              <FaUserShield /> Admin
            </button>
            <button
              className={`auth-toggle-button ${!isLoginAsAdmin ? 'active' : ''}`}
              onClick={() => setIsLoginAsAdmin(false)}
            >
              <FaUser /> Student
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="button button-primary button-fullwidth" style={{ marginTop: '10px' }}>
              Sign In
            </button>

            {message && (
              <div className={`message ${isError ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </form>

          <div className="demo-credentials">
            <strong>Demo Credentials</strong>
            <p><b>Admin:</b> admin@questionpaper.com / admin123</p>
            <p><b>Student:</b> Use your @gvpcdpgc.edu.in email</p>
          </div>

          <p className="register-link">
            New student? <a href="#!">Register here</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;