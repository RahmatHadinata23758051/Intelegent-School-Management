import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const navigationLinkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'

export const Header = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4 7.5 12 4l8 3.5-8 3.5L4 7.5Zm0 4.5 8 3.5 8-3.5M4 16.5 12 20l8-3.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Early Warning Analytics
                </p>
                <p className="text-base font-semibold text-slate-900">ISMS-EWA</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <Link to="/dashboard" className={navigationLinkClass}>
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link to="/classes" className={navigationLinkClass}>
                    Classes
                  </Link>
                  <Link to="/students/add" className={navigationLinkClass}>
                    Add Student
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user && (
              <>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user.role?.replace('_', ' ')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d={mobileMenuOpen ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'}
              />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <Link to="/dashboard" className={navigationLinkClass}>
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link to="/classes" className={navigationLinkClass}>
                    Classes
                  </Link>
                  <Link to="/students/add" className={navigationLinkClass}>
                    Add Student
                  </Link>
                </>
              )}
            </nav>

            {user && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user.role?.replace('_', ' ')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
