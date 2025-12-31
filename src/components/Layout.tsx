import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './Layout.css';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            DarkML
          </Link>
          <nav className="nav">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{getRoleDisplayName(user?.role || '')}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

