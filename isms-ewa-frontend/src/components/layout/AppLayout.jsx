import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Sidebar } from './Sidebar';

/**
 * AppLayout - Modern application shell with clean sidebar
 * 
 * Design System:
 * - Sidebar: Dark navy blue with smooth collapse
 * - Header: Clean white with profile in top right
 * - Main: Light background with proper spacing
 * - Typography: Inter, 14px body, 24px headings
 */
export const AppLayout = ({ children, currentPage = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const pageTitle = {
    dashboard: 'Dashboard',
    students: 'Students',
    classes: 'Classes',
    teachers: 'Teachers',
    subjects: 'Subjects',
    'student-detail': 'Student Details',
    'class-detail': 'Class Details',
    'tahun-ajaran': 'Tahun Ajaran',
    'academic-years': 'Tahun Ajaran',
    'semester': 'Semester',
    'semesters': 'Semester',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Inter,Geist,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-slate-900">
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={clsx('min-h-screen transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {/* Top Bar - Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {pageTitle[currentPage] || 'Dashboard'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back, {user?.name}!
            </p>
          </div>
          
          {/* User Profile - Top Right */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-slate-100 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </button>

            {/* User Menu Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                <div className="border-b border-slate-100 px-4 py-2">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <section className="px-8 py-8">
          {children}
        </section>
      </main>
    </div>
  );
};
