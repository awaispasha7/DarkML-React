import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Progress {
  id: string;
  child?: string;
  student_username?: string;
  class?: string;
  class_name?: string;
  assignment?: string;
  assignment_title?: string;
  score?: string;
  max_score?: string;
  maxScore?: number;
  percentage?: string;
  submission_details?: {
    student_username?: string;
    assignment_title?: string;
  };
}

interface PaginatedResponse {
  count: number;
  results: Progress[];
}

const DUMMY_PROGRESS: Progress[] = [
  { id: '1', child: 'Alice Brown', class: 'Mathematics 101', assignment: 'Math Homework 1', score: '85', max_score: '100', maxScore: 100 },
  { id: '2', child: 'Alice Brown', class: 'Science 201', assignment: 'Science Project', score: '92', max_score: '100', maxScore: 100 },
];

export const Progress: React.FC = () => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Progress[]>(
          () => apiService.get<PaginatedResponse>('/assignments/grades/'),
          DUMMY_PROGRESS
        );
        const progressList = extractResults<Progress>(data);
        // Transform API data to display format
        const transformedProgress: Progress[] = progressList.map((item: Progress) => ({
          id: item.id,
          child: item.student_username || 
                 item.submission_details?.student_username || 
                 item.child || 
                 'Unknown Student',
          class: item.class_name || item.class || 'Unknown Class',
          assignment: item.assignment_title || 
                      item.submission_details?.assignment_title || 
                      item.assignment || 
                      'Unknown Assignment',
          score: item.score || '0',
          max_score: item.max_score || '100',
          percentage: item.percentage,
        }));
        setProgress(transformedProgress.length > 0 ? transformedProgress : DUMMY_PROGRESS);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgress(DUMMY_PROGRESS);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const columns = [
    { key: 'child', header: 'Child' },
    { key: 'class', header: 'Class' },
    { key: 'assignment', header: 'Assignment' },
    { 
      key: 'score', 
      header: 'Score',
      render: (_value: unknown, row: Progress) => {
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
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Progress</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor your children's academic progress</p>
      </div>
      <div className="content-section">
        <h2 className="section-title">Progress Report</h2>
        <DataTable 
          data={progress as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

