import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { StudentDetailPage } from './pages/StudentDetailPage'
import { ClassesPage } from './pages/ClassesPage'
import { AddStudentPage } from './pages/AddStudentPage'
import { Layout } from './components/Layout'
import { useAuth } from './hooks/useAuth'
import './index.css'

const ProtectedRoute = ({ children, isAuthenticated, user, onLogout }) => {
  return isAuthenticated ? (
    <Layout user={user} onLogout={onLogout}>
      {children}
    </Layout>
  ) : (
    <Navigate to="/login" />
  )
}

function App() {
  const { user, loading, login, logout, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={login} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user} onLogout={logout}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user} onLogout={logout}>
              <StudentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/add"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user} onLogout={logout}>
              <AddStudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user} onLogout={logout}>
              <ClassesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
