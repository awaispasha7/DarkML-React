import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { apiService } from '@/services/api';
import { fetchWithFallback, extractResults } from '@/utils/apiHelpers';

interface Class {
  id: string;
  name: string;
  subject_name?: string;
  subject?: string;
  student_count?: string;
  students?: number;
  schedule?: string;
  class_name?: string;
}

interface PaginatedResponse {
  count: number;
  results: Class[];
}

const DUMMY_CLASSES: Class[] = [
  { id: '1', name: 'Mathematics 101', subject: 'Math', students: 25, schedule: 'Mon, Wed, Fri 9:00 AM' },
  { id: '2', name: 'Science 201', subject: 'Science', students: 30, schedule: 'Tue, Thu 10:00 AM' },
];

export const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        // Try to get teacher assignments which include classes
        const data = await fetchWithFallback<PaginatedResponse | Class[]>(
          () => apiService.get<PaginatedResponse>('/academics/teacher-assignments/'),
          DUMMY_CLASSES
        );
        const classList = extractResults<Class>(data);
        // Transform teacher assignments to class format
        const transformedClasses = classList.map((item: Class) => ({
          id: item.id,
          name: item.class_name || item.name || 'Unknown Class',
          subject: item.subject_name || item.subject || 'Unknown Subject',
          students: item.students || parseInt(item.student_count || '0', 10),
          schedule: item.schedule || 'TBD',
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
    { key: 'subject', header: 'Subject' },
    { key: 'students', header: 'Students' },
    { key: 'schedule', header: 'Schedule' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Classes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your classes and students</p>
      </div>
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">All Classes</h2>
          <button className="btn btn-primary">Create Class</button>
        </div>
        <DataTable 
          data={classes as unknown as Record<string, unknown>[]} 
          columns={columns as any}
          loading={loading}
        />
      </div>
    </div>
  );
};

