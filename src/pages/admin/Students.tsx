import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Student {
  id: string;
  username?: string;
  name?: string;
  email: string;
  grade?: string;
  status?: string;
  is_active?: boolean;
}

interface PaginatedResponse {
  count: number;
  results: Student[];
}

const DUMMY_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Brown', email: 'alice@example.com', grade: 'Grade 10', status: 'Active', is_active: true },
  { id: '2', name: 'Bob Wilson', email: 'bob@example.com', grade: 'Grade 11', status: 'Active', is_active: true },
];

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Student[]>(
          () => apiService.get<PaginatedResponse>('/users/profile/?role=STUDENT'),
          DUMMY_STUDENTS
        );
        const studentList = extractResults<Student>(data);
        setStudents(studentList);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents(DUMMY_STUDENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (value: unknown, row: Student) => value || row.username || 'N/A'
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'grade', 
      header: 'Grade',
      render: (value: unknown) => value || 'N/A'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: unknown, row: Student) => {
        if (value) return String(value);
        return row.is_active ? 'Active' : 'Inactive';
      }
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Students</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage all students</p>
      </div>
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">All Students</h2>
          <button className="btn btn-primary">Add Student</button>
        </div>
        <DataTable 
          data={students as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

