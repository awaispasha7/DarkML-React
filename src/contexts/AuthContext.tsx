import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, UserRole } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Development mode - set to true to enable dummy credentials
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV;

// Dummy test users for each role
const DUMMY_USERS: Record<string, { password: string; user: User }> = {
  'admin@darkml.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@darkml.com',
      role: 'admin',
      name: 'Admin User',
      token: 'dummy-admin-token',
    },
  },
  'teacher@darkml.com': {
    password: 'teacher123',
    user: {
      id: '2',
      email: 'teacher@darkml.com',
      role: 'teacher',
      name: 'Teacher User',
      token: 'dummy-teacher-token',
    },
  },
  'student@darkml.com': {
    password: 'student123',
    user: {
      id: '3',
      email: 'student@darkml.com',
      role: 'student',
      name: 'Student User',
      token: 'dummy-student-token',
    },
  },
  'parent@darkml.com': {
    password: 'parent123',
    user: {
      id: '4',
      email: 'parent@darkml.com',
      role: 'parent',
      name: 'Parent User',
      token: 'dummy-parent-token',
    },
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Development mode: check dummy credentials first
      if (DEV_MODE && DUMMY_USERS[credentials.email]) {
        const dummyUser = DUMMY_USERS[credentials.email];
        if (dummyUser.password === credentials.password) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const response = {
            access_token: dummyUser.user.token || 'dummy-token',
            token_type: 'bearer',
            user: dummyUser.user,
          };
          
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          return;
        }
      }

      // Production mode or invalid dummy credentials - use real API
      const response = await apiService.login(credentials.email, credentials.password);
      
      // Store token and user data
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!DEV_MODE) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

