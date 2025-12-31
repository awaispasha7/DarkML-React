import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Teacher {
  id: string;
  username?: string;
  name?: string;
  email: string;
  classes?: number;
  status?: string;
  is_active?: boolean;
}

interface PaginatedResponse {
  count: number;
  results: Teacher[];
}

const DUMMY_TEACHERS: Teacher[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', classes: 5, status: 'Active', is_active: true },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', classes: 3, status: 'Active', is_active: true },
];

export const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Teacher[]>(
          () => apiService.get<PaginatedResponse>('/users/profile/?role=TEACHER'),
          DUMMY_TEACHERS
        );
        const teacherList = extractResults<Teacher>(data);
        setTeachers(teacherList);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers(DUMMY_TEACHERS);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (value: unknown, row: Teacher) => value || row.username || 'N/A'
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'classes', 
      header: 'Classes',
      render: (value: unknown) => value || 0
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: unknown, row: Teacher) => {
        if (value) return String(value);
        return row.is_active ? 'Active' : 'Inactive';
      }
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Teachers</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage teachers and their classes</p>
      </div>
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">All Teachers</h2>
          <button className="btn btn-primary">Add Teacher</button>
        </div>
        <DataTable 
          data={teachers as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

