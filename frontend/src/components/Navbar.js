import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <h1>NextGame</h1>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/games" className="nav-link">Games</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/my-rentals">My Rentals</Link>
            <button onClick={() => logout()} className="auth-button">Sign Out</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="auth-button sign-in">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="auth-button join-free">
              Join Free
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 