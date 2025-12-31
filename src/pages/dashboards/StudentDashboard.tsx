import React, { useEffect, useState } from 'react';
// import { apiService } from '@/services/api'; // Uncomment when API endpoints are ready

interface StudentStats {
  enrolledClasses: number;
  pendingAssignments: number;
  completedAssignments: number;
  averageGrade: number;
}

export const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with actual API endpoint
        // const data = await apiService.get<StudentStats>('/student/stats');
        setStats({
          enrolledClasses: 4,
          pendingAssignments: 3,
          completedAssignments: 12,
          averageGrade: 87.5,
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
        <h1 className="dashboard-title">Student Dashboard</h1>
        <p className="dashboard-subtitle">Your learning journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.enrolledClasses || 0}</div>
          <div className="stat-label">Enrolled Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.pendingAssignments || 0}</div>
          <div className="stat-label">Pending Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.completedAssignments || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.averageGrade?.toFixed(1) || 0}%</div>
          <div className="stat-label">Average Grade</div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Upcoming Assignments</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No upcoming assignments.</p>
      </div>

      <div className="content-section">
        <h2 className="section-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">View Classes</button>
          <button className="btn btn-primary">Submit Assignment</button>
          <button className="btn btn-primary">View Grades</button>
        </div>
      </div>
    </div>
  );
};

