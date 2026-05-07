import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  BarChart3,
  Users,
  AlertTriangle,
  BookOpen,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { ROUTES } from '../../constants/routes';

/**
 * AppLayout - Professional application shell
 * 
 * Design System:
 * - Sidebar: #06182B (dark navy), 256px width
 * - Header: #FAFBFD (off-white), 80px height
 * - Main: #F7F9FC (light background)
 * - Typography: Inter, 14px body, 24px headings
 * - Spacing: 8pt grid (8, 16, 24, 32, 40, 48)
 * - Border radius: 8px (inputs), 12px (cards)
 */
export const AppLayout = ({ children, currentPage = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'academic-setup': true,
    'student-management': false,
  });

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', route: ROUTES.DASHBOARD },
    { 
      id: 'academic-setup', 
      label: 'Academic Setup', 
      disabled: false, 
      isSection: true,
      children: [
        { id: 'tahun-ajaran', icon: Calendar, label: 'Tahun Ajaran', route: ROUTES.ACADEMIC_YEARS },
        { id: 'semester', icon: BookOpen, label: 'Semester', route: ROUTES.SEMESTERS },
      ]
    },
    { 
      id: 'student-management', 
      label: 'Student Management', 
      disabled: false, 
      isSection: true,
      children: [
        { id: 'students', icon: Users, label: 'Students', route: ROUTES.STUDENTS },
        { id: 'classes', icon: BookOpen, label: 'Classes', route: ROUTES.CLASSES },
      ]
    },
    { id: 'staff-directory', icon: Users, label: 'Staff Directory', route: null, disabled: true },
    { id: 'financials', icon: AlertTriangle, label: 'Financials', route: null, disabled: true },
    { id: 'system-settings', icon: Settings, label: 'System Settings', route: null, disabled: true },
  ];

  const pageTitle = {
    dashboard: 'Dashboard',
    students: 'Students',
    classes: 'Classes',
    'student-detail': 'Student Details',
    'class-detail': 'Class Details',
    'tahun-ajaran': 'Tahun Ajaran',
    'academic-years': 'Tahun Ajaran',
    'semester': 'Semester',
    'semesters': 'Semester',
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-[Inter,Geist,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#102033]">
      {/* Sidebar - Professional dark navy */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-800 bg-[#06182B] text-slate-200 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo Section - 80px height, 24px padding */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
                <BarChart3 size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-50">
                  ISMS-EWA
                </div>
                <div className="text-[12px] leading-5 text-slate-400">
                  Dashboard
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation - 8pt grid spacing */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            if (item.isSection && item.children) {
              const isExpanded = expandedSections[item.id];
              return (
                <div key={item.id} className="space-y-2">
                  <button
                    onClick={() => toggleSection(item.id)}
                    disabled={item.disabled}
                    className={clsx(
                      'flex w-full items-center justify-between px-3 text-[13px] font-medium transition',
                      item.disabled
                        ? 'cursor-not-allowed opacity-50 text-slate-500'
                        : 'text-slate-100 hover:text-white'
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={clsx(
                        'transition-transform',
                        isExpanded ? 'rotate-180' : ''
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="space-y-1 border-l border-slate-700 pl-2">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => child.route && navigate(child.route)}
                          className={clsx(
                            'flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[14px] font-medium transition',
                            currentPage === child.id || currentPage === child.route?.split('/')[2]
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          )}
                        >
                          <child.icon size={19} strokeWidth={2} />
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => item.route && navigate(item.route)}
                disabled={item.disabled}
                className={clsx(
                  'flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[14px] font-medium transition',
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : item.disabled
                    ? 'cursor-not-allowed opacity-50 text-slate-500'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                )}
              >
                <item.icon size={19} strokeWidth={2} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section - 24px padding */}
        <div className="space-y-4 px-4 pb-6">
          {sidebarOpen && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/55 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-[15px] font-medium text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-white">
                  {user?.name}
                </div>
                <div className="text-[13px] leading-5 text-slate-400 capitalize">
                  {user?.role}
                </div>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 text-[14px] font-medium text-slate-400 transition hover:text-white"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={clsx('min-h-screen transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {/* Top Bar - 80px height, sticky */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-[#FAFBFD]/95 px-9 backdrop-blur">
          <div>
            <h1 className="text-[24px] font-semibold leading-8 tracking-[-0.02em] text-slate-950">
              {pageTitle[currentPage] || 'Dashboard'}
            </h1>
            <p className="mt-1 text-[14px] font-normal leading-6 text-slate-500">
              Welcome back, {user?.name}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 rounded-lg px-4 py-2 transition hover:bg-slate-100"
              >
                <div className="text-right">
                  <p className="text-[14px] font-medium text-slate-950">{user?.name}</p>
                  <p className="text-[12px] leading-5 text-slate-500 capitalize">{user?.role}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-[15px] font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-2">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content - 32px padding (8pt grid) */}
        <section className="px-9 py-8">
          {children}
        </section>
      </main>
    </div>
  );
};
