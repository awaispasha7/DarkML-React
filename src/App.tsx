import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Unauthorized } from './pages/Unauthorized';

// Admin pages
import { Users } from './pages/admin/Users';
import { Teachers } from './pages/admin/Teachers';
import { Students } from './pages/admin/Students';
import { Parents } from './pages/admin/Parents';

// Teacher pages
import { Classes as TeacherClasses } from './pages/teacher/Classes';
import { Assignments as TeacherAssignments } from './pages/teacher/Assignments';
import { Quizzes as TeacherQuizzes } from './pages/teacher/Quizzes';
import { CreateQuiz } from './pages/teacher/CreateQuiz';
import { Grades as TeacherGrades } from './pages/teacher/Grades';

// Student pages
import { StudentClasses } from './pages/student/Classes';
import { StudentAssignments } from './pages/student/Assignments';
import { StudentQuizzes } from './pages/student/Quizzes';
import { TakeQuiz } from './pages/student/TakeQuiz';
import { StudentGrades } from './pages/student/Grades';

// Parent pages
import { Children } from './pages/parent/Children';
import { Progress } from './pages/parent/Progress';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/app/dashboard" replace />}
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
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/teachers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Teachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/students"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/parents"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Parents />
                </ProtectedRoute>
              }
            />
            {/* Teacher-only routes */}
            <Route
              path="teacher/classes"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/assignments"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/quizzes"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/quizzes/create"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/grades"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherGrades />
                </ProtectedRoute>
              }
            />
            {/* Student-only routes */}
            <Route
              path="student/classes"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/assignments"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/quizzes"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/quizzes/:id/take"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/grades"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentGrades />
                </ProtectedRoute>
              }
            />
            {/* Parent-only routes */}
            <Route
              path="parent/children"
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <Children />
                </ProtectedRoute>
              }
            />
            <Route
              path="parent/progress"
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <Progress />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

