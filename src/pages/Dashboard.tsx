import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { StudentDashboard } from './dashboards/StudentDashboard';
import { ParentDashboard } from './dashboards/ParentDashboard';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return <div className="dashboard-container">{renderDashboard()}</div>;
};

