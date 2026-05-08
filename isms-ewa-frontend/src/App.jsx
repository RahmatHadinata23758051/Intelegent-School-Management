import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { StudentDetailPage } from './pages/students/StudentDetailPage';
import { ClassesPage } from './pages/classes/ClassesPage';
import { ClassDetailPage } from './pages/classes/ClassDetailPage';
import { AcademicYearsPage } from './pages/academic/AcademicYearsPage';
import { SemestersPage } from './pages/academic/SemestersPage';
import { TeachersPage } from './pages/teachers/TeachersPage';
import { SubjectsPage } from './pages/subjects/SubjectsPage';
import { ClassSubjectsPage } from './pages/class-subjects/ClassSubjectsPage';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ErrorBoundary } from './components/common/ErrorBoundary';
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
    <ErrorBoundary>
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

          {/* Academic Years Routes - Protected */}
          <Route
            path={ROUTES.ACADEMIC_YEARS}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <AcademicYearsPage />
              </ProtectedRoute>
            }
          />

          {/* Semesters Routes - Protected */}
          <Route
            path={ROUTES.SEMESTERS}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <SemestersPage />
              </ProtectedRoute>
            }
          />

          {/* Teachers Routes - Protected */}
          <Route
            path="/teachers"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <TeachersPage />
              </ProtectedRoute>
            }
          />

          {/* Subjects Routes - Protected */}
          <Route
            path="/subjects"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <SubjectsPage />
              </ProtectedRoute>
            }
          />

          {/* Class Subjects Routes - Protected */}
          <Route
            path="/class-subjects"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <ClassSubjectsPage />
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
    </ErrorBoundary>
  );
}

export default App;
