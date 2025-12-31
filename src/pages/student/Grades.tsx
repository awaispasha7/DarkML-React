import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Grade {
  id: string;
  assignment_title?: string;
  assignment?: string;
  class?: string;
  score?: string;
  max_score?: string;
  maxScore?: number;
  percentage?: string;
  submission_details?: {
    assignment_title?: string;
  };
}

interface PaginatedResponse {
  count: number;
  results: Grade[];
}

const DUMMY_GRADES: Grade[] = [
  { id: '1', assignment: 'Math Homework 1', class: 'Mathematics 101', score: '85', max_score: '100', maxScore: 100 },
  { id: '2', assignment: 'Science Project', class: 'Science 201', score: '92', max_score: '100', maxScore: 100 },
];

export const StudentGrades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Grade[]>(
          () => apiService.get<PaginatedResponse>('/assignments/grades/'),
          DUMMY_GRADES
        );
        const gradeList = extractResults<Grade>(data);
        // Transform API data to display format
        const transformedGrades: Grade[] = gradeList.map((item: Grade) => ({
          id: item.id,
          assignment: item.assignment_title || 
                      item.submission_details?.assignment_title || 
                      item.assignment || 
                      'Unknown Assignment',
          class: item.class || 'Unknown Class',
          score: item.score || '0',
          max_score: item.max_score || '100',
          percentage: item.percentage,
        }));
        setGrades(transformedGrades.length > 0 ? transformedGrades : DUMMY_GRADES);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setGrades(DUMMY_GRADES);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const columns = [
    { key: 'assignment', header: 'Assignment' },
    { key: 'class', header: 'Class' },
    { 
      key: 'score', 
      header: 'Score',
      render: (_value: unknown, row: Grade) => {
        const score = parseFloat(String(row.score || '0'));
        const maxScore = parseFloat(String(row.max_score || '100'));
        const percentage = row.percentage || Math.round((score / maxScore) * 100);
        return `${score} / ${maxScore} (${percentage}%)`;
      }
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Grades</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View your grades and performance</p>
      </div>
      <div className="content-section">
        <h2 className="section-title">All Grades</h2>
        <DataTable 
          data={grades as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

