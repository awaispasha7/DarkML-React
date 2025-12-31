import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Unauthorized } from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Admin-only routes */}
            <Route
              path="admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Admin Section</div>
                </ProtectedRoute>
              }
            />
            {/* Teacher-only routes */}
            <Route
              path="teacher/*"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <div>Teacher Section</div>
                </ProtectedRoute>
              }
            />
            {/* Student-only routes */}
            <Route
              path="student/*"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <div>Student Section</div>
                </ProtectedRoute>
              }
            />
            {/* Parent-only routes */}
            <Route
              path="parent/*"
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <div>Parent Section</div>
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

