import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface User {
  id: string;
  username?: string;
  name?: string;
  email: string;
  role: string;
  status?: string;
  is_active?: boolean;
}

interface PaginatedResponse {
  count: number;
  results: User[];
  next?: string | null;
  previous?: string | null;
}

const DUMMY_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'TEACHER', status: 'Active', is_active: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'STUDENT', status: 'Active', is_active: true },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'Active', is_active: true },
];

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | User[]>(
          () => apiService.get<PaginatedResponse>('/users/profile/'),
          DUMMY_USERS
        );
        const userList = extractResults<User>(data);
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers(DUMMY_USERS);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (value: unknown, row: User) => value || row.username || 'N/A'
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (value: unknown) => String(value || '').replace('_', ' ').toUpperCase()
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: unknown, row: User) => {
        if (value) return String(value);
        return row.is_active ? 'Active' : 'Inactive';
      }
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Users</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage all users in the system</p>
      </div>
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">All Users</h2>
          <button className="btn btn-primary">Add User</button>
        </div>
        <DataTable 
          data={users as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

