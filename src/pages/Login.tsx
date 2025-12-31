import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import './Login.css';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV;

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email: string, password: string) => {
    setCredentials({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">DarkML</h1>
        <p className="login-subtitle">Educational Platform</p>
        
        {DEV_MODE && (
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #0ea5e9', 
            borderRadius: '0.5rem', 
            padding: '1rem', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <strong style={{ color: '#0369a1', display: 'block', marginBottom: '0.5rem' }}>
              🧪 Development Mode - Test Credentials:
            </strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fillCredentials('admin@darkml.com', 'admin123')}
                style={{ 
                  padding: '0.5rem', 
                  background: '#fff', 
                  border: '1px solid #0ea5e9', 
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <strong>Admin:</strong> admin@darkml.com / admin123
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('teacher@darkml.com', 'teacher123')}
                style={{ 
                  padding: '0.5rem', 
                  background: '#fff', 
                  border: '1px solid #0ea5e9', 
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <strong>Teacher:</strong> teacher@darkml.com / teacher123
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('student@darkml.com', 'student123')}
                style={{ 
                  padding: '0.5rem', 
                  background: '#fff', 
                  border: '1px solid #0ea5e9', 
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <strong>Student:</strong> student@darkml.com / student123
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('parent@darkml.com', 'parent123')}
                style={{ 
                  padding: '0.5rem', 
                  background: '#fff', 
                  border: '1px solid #0ea5e9', 
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <strong>Parent:</strong> parent@darkml.com / parent123
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

