import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { apiService } from '@/services/api'; // Uncomment when API endpoints are ready
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalParents: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchStats = async () => {
      try {
        // Replace with actual API endpoint
        // const data = await apiService.get<DashboardStats>('/admin/stats');
        // For now, using mock data
        setStats({
          totalUsers: 150,
          totalTeachers: 25,
          totalStudents: 100,
          totalParents: 25,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const chartData = stats ? [
    { name: 'Teachers', value: stats.totalTeachers },
    { name: 'Students', value: stats.totalStudents },
    { name: 'Parents', value: stats.totalParents },
  ] : [];

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Overview of platform statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalTeachers || 0}</div>
          <div className="stat-label">Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalStudents || 0}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalParents || 0}</div>
          <div className="stat-label">Parents</div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">User Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="content-section">
        <h2 className="section-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/admin/users')}
          >
            Manage Users
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/admin/teachers')}
          >
            Manage Teachers
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/admin/students')}
          >
            Manage Students
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/admin/parents')}
          >
            Manage Parents
          </button>
        </div>
      </div>
    </div>
  );
};

