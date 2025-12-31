import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { apiService } from '@/services/api'; // Uncomment when API endpoints are ready

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  completedAssignments: number;
}

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with actual API endpoint
        // const data = await apiService.get<TeacherStats>('/teacher/stats');
        setStats({
          totalClasses: 5,
          totalStudents: 120,
          pendingAssignments: 15,
          completedAssignments: 85,
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

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        <p className="dashboard-subtitle">Your teaching overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalClasses || 0}</div>
          <div className="stat-label">Active Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalStudents || 0}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.pendingAssignments || 0}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.completedAssignments || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Recent Activity</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No recent activity to display.</p>
      </div>

      <div className="content-section">
        <h2 className="section-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/teacher/assignments')}
          >
            Create Assignment
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/teacher/classes')}
          >
            View Classes
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/teacher/grades')}
          >
            Grade Submissions
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/teacher/create-quiz')}
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

