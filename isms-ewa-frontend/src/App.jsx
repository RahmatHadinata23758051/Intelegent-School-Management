import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { StudentDetailPage } from './pages/students/StudentDetailPage';
import { ClassesPage } from './pages/classes/ClassesPage';
import { ClassDetailPage } from './pages/classes/ClassDetailPage';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ROUTES } from './constants/routes';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Dashboard Route - Protected */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Students Routes - Protected */}
        <Route
          path={ROUTES.STUDENTS}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_DETAIL}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <StudentDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Classes Routes - Protected */}
        <Route
          path={ROUTES.CLASSES}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <ClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CLASS_DETAIL}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <ClassDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.DASHBOARD} replace />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
