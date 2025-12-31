import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Assignment {
  id: string;
  title: string;
  class_name?: string;
  class?: string;
  due_date?: string;
  dueDate?: string;
  status?: string;
}

interface PaginatedResponse {
  count: number;
  results: Assignment[];
}

const DUMMY_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Math Homework 1', class: 'Mathematics 101', dueDate: '2024-01-15', status: 'Submitted' },
  { id: '2', title: 'Science Project', class: 'Science 201', dueDate: '2024-01-20', status: 'Pending' },
];

export const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Assignment[]>(
          () => apiService.get<PaginatedResponse>('/assignments/assignments/'),
          DUMMY_ASSIGNMENTS
        );
        const assignmentList = extractResults<Assignment>(data);
        // Transform API data to display format
        const transformedAssignments = assignmentList.map((item: Assignment) => ({
          id: item.id,
          title: item.title,
          class: item.class_name || item.class || 'Unknown Class',
          dueDate: item.due_date || item.dueDate || 'N/A',
          status: item.status || 'Pending',
        }));
        setAssignments(transformedAssignments.length > 0 ? transformedAssignments : DUMMY_ASSIGNMENTS);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments(DUMMY_ASSIGNMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'class', header: 'Class' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Assignments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and submit your assignments</p>
      </div>
      <div className="content-section">
        <h2 className="section-title">My Assignments</h2>
        <DataTable 
          data={assignments as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

