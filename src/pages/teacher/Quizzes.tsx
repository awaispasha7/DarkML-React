import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Quiz {
  id: string;
  title: string;
  class: string;
  subject: string;
  dueDate: string;
  duration: number; // in minutes
  totalQuestions: number;
  submissions: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
}

interface PaginatedResponse {
  count: number;
  results: Quiz[];
}

const DUMMY_QUIZZES: Quiz[] = [
        {
          id: '1',
          title: 'Math Quiz - Chapter 5',
          class: 'Mathematics 101',
          subject: 'Mathematics',
          dueDate: '2024-01-20T10:00:00',
          duration: 30,
          totalQuestions: 10,
          submissions: 15,
          status: 'PUBLISHED',
        },
        {
          id: '2',
          title: 'Science Quiz - Biology Basics',
          class: 'Science 201',
          subject: 'Science',
          dueDate: '2024-01-25T14:00:00',
          duration: 45,
          totalQuestions: 15,
          submissions: 8,
          status: 'PUBLISHED',
        },
        {
          id: '3',
          title: 'History Quiz - World War II',
          class: 'History 301',
          subject: 'History',
          dueDate: '2024-01-18T09:00:00',
          duration: 20,
          totalQuestions: 8,
          submissions: 22,
          status: 'CLOSED',
        },
];

export const Quizzes: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        // Note: Quiz endpoints are not in the API docs yet
        // When available, uncomment and use: '/quizzes/quizzes/'
        // For now, try assignments as a fallback or use dummy data
        const data = await fetchWithFallback<PaginatedResponse | Quiz[]>(
          async () => {
            // Try quiz endpoint if it exists (will fail gracefully)
            try {
              return await apiService.get<PaginatedResponse>('/quizzes/quizzes/');
            } catch {
              // If quiz endpoint doesn't exist, return null to use dummy data
              throw new Error('Quiz endpoint not available');
            }
          },
          DUMMY_QUIZZES
        );
        const quizList = extractResults<Quiz>(data);
        setQuizzes(quizList.length > 0 ? quizList : DUMMY_QUIZZES);
      } catch (error) {
        console.warn('Error fetching quizzes, using dummy data:', error);
        setQuizzes(DUMMY_QUIZZES);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'class', header: 'Class' },
    { key: 'subject', header: 'Subject' },
    { 
      key: 'dueDate', 
      header: 'Due Date',
      render: (value: unknown) => {
        const date = new Date(value as string);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },
    { 
      key: 'duration', 
      header: 'Duration',
      render: (value: unknown) => `${value} min`
    },
    { key: 'totalQuestions', header: 'Questions' },
    { key: 'submissions', header: 'Submissions' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: unknown) => {
        const status = value as string;
        const colors: Record<string, string> = {
          DRAFT: '#64748b',
          PUBLISHED: '#10b981',
          CLOSED: '#ef4444',
        };
        return (
          <span style={{ 
            color: colors[status] || '#64748b',
            fontWeight: 500,
            textTransform: 'capitalize'
          }}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_value: unknown, row: Quiz) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
            onClick={() => navigate(`/app/teacher/quizzes/${row.id}`)}
          >
            View
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
            onClick={() => navigate(`/app/teacher/quizzes/${row.id}/submissions`)}
          >
            Submissions
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quizzes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create and manage quizzes for your classes</p>
      </div>
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">All Quizzes</h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/app/teacher/quizzes/create')}
          >
            Create Quiz
          </button>
        </div>
        <DataTable 
          data={quizzes as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

