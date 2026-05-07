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
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen bg-slate-900 transition-all duration-300 z-40 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">ISMS-EWA</div>
                <div className="text-xs text-slate-400">Dashboard</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.isSection && item.children) {
              const isExpanded = expandedSections[item.id];
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleSection(item.id)}
                    disabled={item.disabled}
                    className={clsx(
                      'w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-sm font-medium',
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed text-slate-500'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                    <div className="ml-2 mt-1 space-y-1 border-l border-slate-700 pl-3">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => child.route && navigate(child.route)}
                          className={clsx(
                            'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm',
                            currentPage === child.id || currentPage === child.route?.split('/')[2]
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          )}
                        >
                          <child.icon size={18} />
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
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium',
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : item.disabled
                    ? 'opacity-50 cursor-not-allowed text-slate-500'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {sidebarOpen && (
            <div className="p-3 bg-slate-800 rounded-lg">
              <p className="text-xs font-medium text-slate-400">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate mt-1">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize mt-1">{user?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={clsx('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {/* Top Bar */}
        <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{pageTitle[currentPage] || 'Dashboard'}</h1>
            <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
