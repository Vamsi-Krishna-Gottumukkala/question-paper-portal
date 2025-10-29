// frontend/src/pages/AuthPage.js
import React, { useState } from 'react';
import { FaGraduationCap, FaUserShield, FaUser } from 'react-icons/fa';

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
      if (email === 'admin.questionpaper@gmail.com' && password === 'adminpass') {
        onLoginSuccess('admin');
      } else {
        setMessage('Invalid Admin credentials.');
        setIsError(true);
      }
    } else {
      if (email === 'student.test@gmail.com' && password === 'studentpass') {
        onLoginSuccess('student');
      } else {
        setMessage('Invalid Student credentials.');
        setIsError(true);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <FaGraduationCap style={{ fontSize: '50px', color: 'var(--color-accent-blue)', marginBottom: '15px' }} />
        <h1>Question Paper Library</h1>
        <p className="description">Access your academic resources</p>

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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
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
            {isLoginAsAdmin ? 'Sign in as Admin' : 'Sign in as Student'}
          </button>
          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AuthPage;