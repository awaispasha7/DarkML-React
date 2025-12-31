import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Child {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  grade?: string;
  classes?: number;
  averageGrade?: number;
}

interface PaginatedResponse {
  count: number;
  results: Child[];
}

const DUMMY_CHILDREN: Child[] = [
  { id: '1', name: 'Alice Brown', grade: 'Grade 10', classes: 5, averageGrade: 87.5 },
  { id: '2', name: 'Bob Brown', grade: 'Grade 8', classes: 4, averageGrade: 92.0 },
];

export const Children: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        // Parents would typically get their children through a relationship endpoint
        // For now, try to get students (children) or use dummy data
        const data = await fetchWithFallback<PaginatedResponse | Child[]>(
          () => apiService.get<PaginatedResponse>('/users/profile/?role=STUDENT'),
          DUMMY_CHILDREN
        );
        const childList = extractResults<Child>(data);
        setChildren(childList.length > 0 ? childList : DUMMY_CHILDREN);
      } catch (error) {
        console.error('Error fetching children:', error);
        setChildren(DUMMY_CHILDREN);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (value: unknown, row: Child) => value || row.username || 'N/A'
    },
    { key: 'grade', header: 'Grade' },
    { 
      key: 'classes', 
      header: 'Classes',
      render: (value: unknown) => value || 0
    },
    { 
      key: 'averageGrade', 
      header: 'Average Grade',
      render: (value: unknown) => value ? `${Number(value).toFixed(1)}%` : 'N/A'
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Children</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View your children's information</p>
      </div>
      <div className="content-section">
        <h2 className="section-title">Children</h2>
        <DataTable 
          data={children as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

