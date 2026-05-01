import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Header = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold">
            ISMS-EWA
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/dashboard" className="hover:text-blue-100 transition">
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/classes" className="hover:text-blue-100 transition">
                  Classes
                </Link>
                <Link to="/students/add" className="hover:text-blue-100 transition">
                  Add Student
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs opacity-75 capitalize">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4">
          <nav className="flex flex-col gap-4">
            <Link to="/dashboard" className="hover:text-blue-100">
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/classes" className="hover:text-blue-100">
                  Classes
                </Link>
                <Link to="/students/add" className="hover:text-blue-100">
                  Add Student
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
