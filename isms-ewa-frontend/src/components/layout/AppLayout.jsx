import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDown, LogOut, Bell, User, Settings, Lock } from 'lucide-react';
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
          
          {/* User Profile - Top Right - CLEAN DESIGN LIKE IMAGE */}
          <div className="flex items-center gap-4">
            {/* Bell Notification */}
            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} strokeWidth={2} />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
              >
                {/* Avatar with photo placeholder */}
                <div className="relative h-12 w-12 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                  {/* Placeholder - nanti bisa diganti foto real */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 text-slate-600 font-semibold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* User Info */}
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                
                {/* Chevron */}
                <ChevronDown 
                  size={18} 
                  className={clsx(
                    "text-slate-400 transition-transform duration-200",
                    userMenuOpen && "rotate-180"
                  )} 
                />
              </button>

              {/* Dropdown Menu - CLEAN DESIGN */}
              {userMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Profil Saya */}
                      <button
                        onClick={() => {
                          // Navigate to profile
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <User size={18} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Profil Saya</span>
                      </button>

                      {/* Pengaturan Akun */}
                      <button
                        onClick={() => {
                          // Navigate to settings
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Settings size={18} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Pengaturan Akun</span>
                      </button>

                      {/* Ganti Password */}
                      <button
                        onClick={() => {
                          // Navigate to change password
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Lock size={18} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Ganti Password</span>
                      </button>

                      {/* Divider */}
                      <div className="my-2 border-t border-slate-200"></div>

                      {/* Keluar / Logout */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          <LogOut size={18} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-red-600">Keluar</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
