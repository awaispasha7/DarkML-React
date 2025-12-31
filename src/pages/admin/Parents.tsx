import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Parent {
  id: string;
  username?: string;
  name?: string;
  email: string;
  children?: number;
  status?: string;
  is_active?: boolean;
}

interface PaginatedResponse {
  count: number;
  results: Parent[];
}

const DUMMY_PARENTS: Parent[] = [
  { id: '1', name: 'Mike Davis', email: 'mike@example.com', children: 2, status: 'Active', is_active: true },
  { id: '2', name: 'Lisa Anderson', email: 'lisa@example.com', children: 1, status: 'Active', is_active: true },
];

export const Parents: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Parent[]>(
          () => apiService.get<PaginatedResponse>('/users/profile/?role=PARENT'),
          DUMMY_PARENTS
        );
        const parentList = extractResults<Parent>(data);
        setParents(parentList);
      } catch (error) {
        console.error('Error fetching parents:', error);
        setParents(DUMMY_PARENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (value: unknown, row: Parent) => value || row.username || 'N/A'
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'children', 
      header: 'Children',
      render: (value: unknown) => value || 0
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: unknown, row: Parent) => {
        if (value) return String(value);
        return row.is_active ? 'Active' : 'Inactive';
      }
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Parents</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage parents and their children</p>
      </div>
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">All Parents</h2>
          <button className="btn btn-primary">Add Parent</button>
        </div>
        <DataTable 
          data={parents as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

