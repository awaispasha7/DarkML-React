import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

export const Unauthorized: React.FC = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">403</h1>
        <h2 className="unauthorized-subtitle">Access Denied</h2>
        <p className="unauthorized-message">
          You don't have permission to access this resource.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

