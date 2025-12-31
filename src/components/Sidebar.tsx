import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import './Sidebar.css';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    path: '/app/dashboard',
    label: 'Dashboard',
    icon: '📊',
    roles: ['admin', 'teacher', 'student', 'parent'],
  },
  {
    path: '/app/admin/users',
    label: 'Users',
    icon: '👥',
    roles: ['admin'],
  },
  {
    path: '/app/admin/teachers',
    label: 'Teachers',
    icon: '👨‍🏫',
    roles: ['admin'],
  },
  {
    path: '/app/admin/students',
    label: 'Students',
    icon: '👨‍🎓',
    roles: ['admin'],
  },
  {
    path: '/app/admin/parents',
    label: 'Parents',
    icon: '👨‍👩‍👧',
    roles: ['admin'],
  },
  {
    path: '/app/teacher/classes',
    label: 'Classes',
    icon: '📚',
    roles: ['teacher'],
  },
  {
    path: '/app/teacher/assignments',
    label: 'Assignments',
    icon: '📝',
    roles: ['teacher'],
  },
  {
    path: '/app/teacher/quizzes',
    label: 'Quizzes',
    icon: '📋',
    roles: ['teacher'],
  },
  {
    path: '/app/teacher/grades',
    label: 'Grades',
    icon: '📊',
    roles: ['teacher'],
  },
  {
    path: '/app/student/classes',
    label: 'My Classes',
    icon: '📚',
    roles: ['student'],
  },
  {
    path: '/app/student/assignments',
    label: 'Assignments',
    icon: '📝',
    roles: ['student'],
  },
  {
    path: '/app/student/quizzes',
    label: 'Quizzes',
    icon: '📋',
    roles: ['student'],
  },
  {
    path: '/app/student/grades',
    label: 'My Grades',
    icon: '📊',
    roles: ['student'],
  },
  {
    path: '/app/parent/children',
    label: 'My Children',
    icon: '👶',
    roles: ['parent'],
  },
  {
    path: '/app/parent/progress',
    label: 'Progress',
    icon: '📈',
    roles: ['parent'],
  },
];

export const Sidebar: React.FC = () => {
  const { hasRole } = useAuth();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles.length === 0) return true;
    return hasRole(item.roles);
  });

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {filteredMenuItems.map((item) => {
            return (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  end={item.path === '/app/dashboard'}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

