import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithFallback } from '@/utils/apiHelpers';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StudentStats {
  enrolledClasses: number;
  pendingAssignments: number;
  completedAssignments: number;
  averageGrade: number;
}

interface Recommendation {
  id: string;
  content: string;
  timestamp: string;
  category: 'skill_gap' | 'misconception' | 'mastery_gap' | 'learning_velocity' | 'other';
  status: 'in_progress' | 'completed' | 'pending';
}

interface AnalyticsData {
  feedbackResponseRate: number; // 0 to 1.0
  curriculumAlignmentScore: number; // 0 to 100
  historicalProgress: Array<{
    period: string;
    mastery: number;
    change: number;
  }>;
  recommendations: Recommendation[];
}

const DUMMY_ANALYTICS: AnalyticsData = {
  feedbackResponseRate: 0.75,
  curriculumAlignmentScore: 88.2,
  historicalProgress: [
    { period: 'Week 1', mastery: 60.2, change: 0 },
    { period: 'Week 2', mastery: 63.5, change: 3.3 },
    { period: 'Week 3', mastery: 67.1, change: 3.6 },
    { period: 'Week 4', mastery: 70.8, change: 3.7 },
    { period: 'Week 5', mastery: 73.2, change: 2.4 },
    { period: 'Week 6', mastery: 75.6, change: 2.4 },
  ],
  recommendations: [
    {
      id: '1',
      content: 'Focus on fractions, geometry proofs, vocabulary',
      timestamp: '2024-12-25T14:00:00Z',
      category: 'skill_gap',
      status: 'in_progress',
    },
    {
      id: '2',
      content: 'Review algebraic equations and practice problem-solving',
      timestamp: '2024-12-20T10:30:00Z',
      category: 'mastery_gap',
      status: 'completed',
    },
    {
      id: '3',
      content: 'Work on reading comprehension strategies',
      timestamp: '2024-12-18T09:15:00Z',
      category: 'learning_velocity',
      status: 'in_progress',
    },
  ],
};

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic stats
        const statsData = await fetchWithFallback<StudentStats>(
          async () => {
            // Try to get from API if endpoint exists
            throw new Error('Stats endpoint not available');
          },
          {
            enrolledClasses: 4,
            pendingAssignments: 3,
            completedAssignments: 12,
            averageGrade: 87.5,
          }
        );
        setStats(statsData);

        // Fetch analytics data
        const analyticsData = await fetchWithFallback<AnalyticsData>(
          async () => {
            // Try to get from API if endpoint exists
            // await apiService.get<AnalyticsData>('/ai/student-insights/{student_id}/');
            throw new Error('Analytics endpoint not available');
          },
          DUMMY_ANALYTICS
        );
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      skill_gap: '#ef4444',
      misconception: '#f59e0b',
      mastery_gap: '#3b82f6',
      learning_velocity: '#10b981',
      other: '#64748b',
    };
    return colors[category] || colors.other;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      in_progress: { bg: '#fef3c7', color: '#d97706' },
      completed: { bg: '#d1fae5', color: '#059669' },
      pending: { bg: '#e0e7ff', color: '#4338ca' },
    };
    const style = styles[status] || styles.pending;
    return (
      <span
        style={{
          background: style.bg,
          color: style.color,
          padding: '0.25rem 0.75rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          textTransform: 'capitalize',
        }}
      >
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

      {/* Personalized Learning Analytics Section */}
      <div className="content-section">
        <h2 className="section-title">Personalized Learning Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Track your individual progress, learning preferences, and adaptive development paths
        </p>

        {/* Analytics Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Feedback Response Rate */}
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Feedback Response Rate</h3>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Responsiveness</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: analytics && analytics.feedbackResponseRate >= 0.7 ? '#10b981' : analytics && analytics.feedbackResponseRate >= 0.5 ? '#f59e0b' : '#ef4444', marginBottom: '0.5rem' }}>
              {(analytics?.feedbackResponseRate || 0) * 100}%
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '0.5rem', height: '0.5rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  background: analytics && analytics.feedbackResponseRate >= 0.7 ? '#10b981' : analytics && analytics.feedbackResponseRate >= 0.5 ? '#f59e0b' : '#ef4444',
                  height: '100%',
                  borderRadius: '0.5rem',
                  width: `${(analytics?.feedbackResponseRate || 0) * 100}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              {analytics && analytics.feedbackResponseRate >= 0.7
                ? 'Excellent responsiveness to feedback'
                : analytics && analytics.feedbackResponseRate >= 0.5
                ? 'Good responsiveness to feedback'
                : 'Consider acting on more feedback'}
            </p>
          </div>

          {/* Curriculum Alignment Score */}
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Curriculum Alignment</h3>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>On Track</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: analytics && analytics.curriculumAlignmentScore >= 80 ? '#10b981' : analytics && analytics.curriculumAlignmentScore >= 70 ? '#f59e0b' : '#ef4444', marginBottom: '0.5rem' }}>
              {analytics?.curriculumAlignmentScore?.toFixed(1) || 0}%
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '0.5rem', height: '0.5rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  background: analytics && analytics.curriculumAlignmentScore >= 80 ? '#10b981' : analytics && analytics.curriculumAlignmentScore >= 70 ? '#f59e0b' : '#ef4444',
                  height: '100%',
                  borderRadius: '0.5rem',
                  width: `${analytics?.curriculumAlignmentScore || 0}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              {analytics && analytics.curriculumAlignmentScore >= 80
                ? 'Well aligned with curriculum timeline'
                : analytics && analytics.curriculumAlignmentScore >= 70
                ? 'Slightly behind schedule'
                : 'Needs attention to catch up'}
            </p>
          </div>
        </div>

        {/* Historical Progress Chart */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Historical Progress</h3>
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow)' }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.historicalProgress || []}>
                <defs>
                  <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card-bg)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'mastery') return [`${value.toFixed(1)}%`, 'Mastery Level'];
                    if (name === 'change') return [`${value > 0 ? '+' : ''}${value.toFixed(1)}%`, 'Change'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="mastery"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMastery)"
                  name="Mastery Level"
                />
                <Line
                  type="monotone"
                  dataKey="change"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Weekly Change"
                />
              </AreaChart>
            </ResponsiveContainer>
            {analytics?.historicalProgress && analytics.historicalProgress.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#0369a1' }}>
                  <strong>Latest Progress:</strong>{' '}
                  {analytics.historicalProgress[analytics.historicalProgress.length - 1].change > 0 ? '+' : ''}
                  {analytics.historicalProgress[analytics.historicalProgress.length - 1].change.toFixed(1)}% improvement this week
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personalized Recommendation History */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Personalized Recommendation History</h3>
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow)' }}>
            {analytics?.recommendations && analytics.recommendations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analytics.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      background: '#f9fafb',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {rec.content}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              background: getCategoryColor(rec.category),
                              color: '#fff',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                            }}
                          >
                            {rec.category.replace('_', ' ')}
                          </span>
                          {getStatusBadge(rec.status)}
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {formatDate(rec.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                No recommendations available yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Upcoming Assignments</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No upcoming assignments.</p>
      </div>

      <div className="content-section">
        <h2 className="section-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/student/classes')}
          >
            View Classes
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/student/assignments')}
          >
            Submit Assignment
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/student/grades')}
          >
            View Grades
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/student/quizzes')}
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

