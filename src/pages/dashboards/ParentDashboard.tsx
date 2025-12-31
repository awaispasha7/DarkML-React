import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { apiService } from '@/services/api'; // Uncomment when API endpoints are ready

interface ParentStats {
  childrenCount: number;
  totalClasses: number;
  pendingAssignments: number;
  averageGrade: number;
}

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ParentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with actual API endpoint
        // const data = await apiService.get<ParentStats>('/parent/stats');
        setStats({
          childrenCount: 2,
          totalClasses: 8,
          pendingAssignments: 5,
          averageGrade: 85.0,
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
        <h1 className="dashboard-title">Parent Dashboard</h1>
        <p className="dashboard-subtitle">Monitor your children's progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.childrenCount || 0}</div>
          <div className="stat-label">Children</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalClasses || 0}</div>
          <div className="stat-label">Total Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.pendingAssignments || 0}</div>
          <div className="stat-label">Pending Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.averageGrade?.toFixed(1) || 0}%</div>
          <div className="stat-label">Average Grade</div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Children's Progress</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No progress data available.</p>
      </div>

      <div className="content-section">
        <h2 className="section-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/parent/children')}
          >
            View Children
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/parent/progress')}
          >
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

