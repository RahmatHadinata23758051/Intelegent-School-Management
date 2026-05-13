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
          
          {/* User Profile - Top Right - PREMIUM DESIGN */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="group flex items-center gap-3 rounded-xl px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
                {/* Avatar */}
                <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/30 ring-2 ring-white group-hover:scale-110 transition-transform duration-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <ChevronDown 
                size={16} 
                className={clsx(
                  "text-slate-500 group-hover:text-blue-600 transition-all duration-300",
                  userMenuOpen && "rotate-180"
                )} 
              />
            </button>

            {/* User Menu Dropdown - PREMIUM */}
            {userMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserMenuOpen(false)}
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                  {/* Gradient Header */}
                  <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 px-6 py-5">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                    
                    <div className="relative flex items-center gap-4">
                      {/* Large Avatar */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-white/30 blur-md" />
                        <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white text-lg font-bold text-blue-600 shadow-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-base font-bold text-white">{user?.name}</p>
                        <p className="text-sm text-blue-100 capitalize mt-0.5">{user?.role}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-medium text-white">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left rounded-xl text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-colors">
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              </>
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
