import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  ChevronDown,
  LogOut,
  Bell,
  User,
  Settings,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Sidebar } from './Sidebar';

/**
 * AppLayout - Modern application shell
 *
 * Fokus redesign:
 * - Profile top-right dibuat lebih natural dan tidak "AI slop"
 * - Dropdown lebih clean dan realistis
 * - Sidebar / logic utama tetap dipertahankan
 */
export const AppLayout = ({ children, currentPage = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

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
    semester: 'Semester',
    semesters: 'Semester',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-[Inter,Geist,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-slate-900">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main
        className={clsx(
          'min-h-screen transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 shadow-sm backdrop-blur lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {pageTitle[currentPage] || 'Dashboard'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back, {user?.name}!
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Notification */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
            >
              <Bell size={18} strokeWidth={2} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Profile */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-expanded={userMenuOpen}
                className={clsx(
                  'group flex items-center gap-3 rounded-full border px-2 py-1.5 transition-all',
                  userMenuOpen
                    ? 'border-slate-300 bg-white shadow-sm'
                    : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50'
                )}
              >
                {/* User text */}
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-5 text-slate-900">
                    {user?.name || 'Admin ISMS-EWA'}
                  </p>
                  <div className="mt-0.5 flex items-center justify-end gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs capitalize text-slate-500">
                      {user?.role || 'admin'}
                    </p>
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={16}
                  className={clsx(
                    'text-slate-400 transition duration-200 group-hover:text-slate-600',
                    userMenuOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-3 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
                  {/* User summary */}
                  <div className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user?.name || 'Admin ISMS-EWA'}
                        </p>
                        <p className="mt-0.5 truncate text-xs capitalize text-slate-500">
                          {user?.role || 'admin'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <DropdownItem
                      icon={<User size={17} strokeWidth={2} />}
                      label="Profil Saya"
                      onClick={() => {
                        setUserMenuOpen(false);
                      }}
                    />

                    <DropdownItem
                      icon={<Settings size={17} strokeWidth={2} />}
                      label="Pengaturan Akun"
                      onClick={() => {
                        setUserMenuOpen(false);
                      }}
                    />

                    <DropdownItem
                      icon={<Lock size={17} strokeWidth={2} />}
                      label="Ganti Password"
                      onClick={() => {
                        setUserMenuOpen(false);
                      }}
                    />

                    <div className="my-2 border-t border-slate-100" />

                    <DropdownItem
                      danger
                      icon={<LogOut size={17} strokeWidth={2} />}
                      label="Keluar"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="px-6 py-8 lg:px-8">{children}</section>
      </main>
    </div>
  );
};

function DropdownItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'mx-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        danger ? 'hover:bg-red-50' : 'hover:bg-slate-50'
      )}
    >
      <div
        className={clsx(
          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          danger
            ? 'bg-slate-100 text-slate-600 group-hover:bg-red-100'
            : 'bg-slate-100 text-slate-600'
        )}
      >
        {icon}
      </div>

      <span
        className={clsx(
          'text-sm font-medium',
          danger ? 'text-slate-700 hover:text-red-600' : 'text-slate-700'
        )}
      >
        {label}
      </span>
    </button>
  );
}