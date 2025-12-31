import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, logout } = useAuth();

  // If user is already logged in, show option to switch roles
  useEffect(() => {
    // Optional: Auto-redirect if already logged in
    // if (isAuthenticated) {
    //   navigate('/dashboard');
    // }
  }, [isAuthenticated, navigate]);

  const handleRoleAccess = async (role: 'admin' | 'teacher' | 'student' | 'parent') => {
    // If already logged in, logout first
    if (isAuthenticated) {
      await logout();
    }
    // Auto-login with dummy credentials based on role
    const credentials = {
      admin: { email: 'admin@darkml.com', password: 'admin123' },
      teacher: { email: 'teacher@darkml.com', password: 'teacher123' },
      student: { email: 'student@darkml.com', password: 'student123' },
      parent: { email: 'parent@darkml.com', password: 'parent123' },
    };

    try {
      await login(credentials[role]);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Auto-login failed:', error);
      // Even if login fails, navigate to dashboard (for dev mode)
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">DarkML</h1>
          <p className="home-subtitle">Educational Platform</p>
          <p className="home-description">
            Access different role dashboards to explore the platform
          </p>
        </div>

        <div className="home-menu">
          <div className="menu-grid">
            <div 
              className="menu-card admin-card"
              onClick={() => handleRoleAccess('admin')}
            >
              <div className="menu-icon">👨‍💼</div>
              <h2 className="menu-title">Admin</h2>
              <p className="menu-description">
                Access admin dashboard to manage users, teachers, students, and parents
              </p>
              <div className="menu-features">
                <span className="feature-tag">Users</span>
                <span className="feature-tag">Teachers</span>
                <span className="feature-tag">Students</span>
                <span className="feature-tag">Parents</span>
              </div>
            </div>

            <div 
              className="menu-card teacher-card"
              onClick={() => handleRoleAccess('teacher')}
            >
              <div className="menu-icon">👨‍🏫</div>
              <h2 className="menu-title">Teacher</h2>
              <p className="menu-description">
                Access teacher dashboard to manage classes, assignments, and grades
              </p>
              <div className="menu-features">
                <span className="feature-tag">Classes</span>
                <span className="feature-tag">Assignments</span>
                <span className="feature-tag">Grades</span>
              </div>
            </div>

            <div 
              className="menu-card student-card"
              onClick={() => handleRoleAccess('student')}
            >
              <div className="menu-icon">👨‍🎓</div>
              <h2 className="menu-title">Student</h2>
              <p className="menu-description">
                Access student dashboard to view classes, assignments, and grades
              </p>
              <div className="menu-features">
                <span className="feature-tag">My Classes</span>
                <span className="feature-tag">Assignments</span>
                <span className="feature-tag">My Grades</span>
              </div>
            </div>

            <div 
              className="menu-card parent-card"
              onClick={() => handleRoleAccess('parent')}
            >
              <div className="menu-icon">👨‍👩‍👧</div>
              <h2 className="menu-title">Parent</h2>
              <p className="menu-description">
                Access parent dashboard to monitor children's progress and performance
              </p>
              <div className="menu-features">
                <span className="feature-tag">My Children</span>
                <span className="feature-tag">Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-footer">
          <p className="footer-text">
            Or <a href="/login" className="login-link">login with your credentials</a>
          </p>
        </div>
      </div>
    </div>
  );
};

