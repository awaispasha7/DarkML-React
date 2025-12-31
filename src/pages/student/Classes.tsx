import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Class {
  id: string;
  class_name?: string;
  name?: string;
  teacher?: string;
  schedule?: string;
  status?: string;
  is_active?: boolean;
}

interface PaginatedResponse {
  count: number;
  results: Class[];
}

const DUMMY_CLASSES: Class[] = [
  { id: '1', name: 'Mathematics 101', teacher: 'John Doe', schedule: 'Mon, Wed, Fri 9:00 AM', status: 'Enrolled' },
  { id: '2', name: 'Science 201', teacher: 'Sarah Johnson', schedule: 'Tue, Thu 10:00 AM', status: 'Enrolled' },
];

export const StudentClasses: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await fetchWithFallback<PaginatedResponse | Class[]>(
          () => apiService.get<PaginatedResponse>('/academics/student-enrollments/'),
          DUMMY_CLASSES
        );
        const classList = extractResults<Class>(data);
        // Transform student enrollments to class format
        const transformedClasses = classList.map((item: Class) => ({
          id: item.id,
          name: item.class_name || item.name || 'Unknown Class',
          teacher: item.teacher || 'TBD',
          schedule: item.schedule || 'TBD',
          status: item.status || (item.is_active ? 'Enrolled' : 'Inactive'),
        }));
        setClasses(transformedClasses.length > 0 ? transformedClasses : DUMMY_CLASSES);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses(DUMMY_CLASSES);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const columns = [
    { key: 'name', header: 'Class Name' },
    { key: 'teacher', header: 'Teacher' },
    { key: 'schedule', header: 'Schedule' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Classes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View your enrolled classes</p>
      </div>
      <div className="content-section">
        <h2 className="section-title">Enrolled Classes</h2>
        <DataTable 
          data={classes as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

