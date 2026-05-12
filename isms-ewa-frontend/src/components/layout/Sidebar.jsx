import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Users,
  BookOpen,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Settings,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import CerdikLogo from '../../assets/Cerdik.png';

/**
 * Sidebar Component - Clean and organized navigation
 * Modern design with logo, sections, and smooth interactions
 */
export const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentPage = 'dashboard',
  onLogout = null 
}) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    'academic-setup': true,
    'student-management': false,
    'financials': false,
    'system-settings': false,
  });

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleNavigate = (route) => {
    if (route) {
      navigate(route);
    }
  };

  // Navigation structure
  const navItems = [
    {
      id: 'dashboard',
      icon: BarChart3,
      label: 'Dashboard',
      route: ROUTES.DASHBOARD,
      type: 'item',
    },
    {
      id: 'academic-setup',
      label: 'ACADEMIC SETUP',
      type: 'section',
      children: [
        {
          id: 'tahun-ajaran',
          icon: Calendar,
          label: 'Tahun Ajaran',
          route: ROUTES.ACADEMIC_YEARS,
        },
        {
          id: 'semester',
          icon: BookOpen,
          label: 'Semester',
          route: ROUTES.SEMESTERS,
        },
        {
          id: 'class-subjects',
          icon: BookOpen,
          label: 'Assignment Mapel Kelas',
          route: '/class-subjects',
        },
      ],
    },
    {
      id: 'student-management',
      label: 'STUDENT MANAGEMENT',
      type: 'section',
      children: [
        {
          id: 'student-directory',
          icon: Users,
          label: 'Student Directory',
          route: ROUTES.STUDENTS,
        },
      ],
    },
    {
      id: 'financials',
      label: 'FINANCIALS',
      type: 'section',
      children: [
        {
          id: 'keuangan',
          icon: DollarSign,
          label: 'Keuangan',
          route: null,
          disabled: true,
        },
      ],
    },
    {
      id: 'system-settings',
      label: 'SYSTEM SETTINGS',
      type: 'section',
      children: [
        {
          id: 'pengaturan-sistem',
          icon: Settings,
          label: 'Pengaturan Sistem',
          route: null,
          disabled: true,
        },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-20 flex flex-col',
        'bg-white border-r border-slate-200',
        'text-slate-900',
        'transition-all duration-300 ease-out',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* ===== LOGO SECTION ===== */}
      <div
        className={clsx(
          'flex items-center justify-between',
          'px-4 py-5',
          'border-b border-slate-200'
        )}
      >
        {sidebarOpen && (
          <div className="flex items-center gap-3 flex-1">
            {/* Logo Image */}
            <img 
              src={CerdikLogo} 
              alt="ISMS-EWA Logo" 
              className="h-14 w-14 rounded-lg flex-shrink-0 object-cover"
            />

            {/* Logo Text */}
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-slate-900 truncate">
                ISMS-EWA
              </div>
              <div className="text-xs text-slate-500 truncate">
                Dashboard
              </div>
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={clsx(
            'rounded-lg p-2',
            'text-slate-400 hover:text-slate-600',
            'hover:bg-slate-100',
            'transition-all duration-200',
            'flex-shrink-0',
            sidebarOpen ? 'ml-2' : ''
          )}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft size={20} strokeWidth={2} />
          ) : (
            <ChevronLeft size={20} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          // Section Header with Children
          if (item.type === 'section') {
            const isExpanded = expandedSections[item.id];

            return (
              <div key={item.id} className="space-y-1">
                {/* Section Header Button */}
                <button
                  onClick={() => toggleSection(item.id)}
                  className={clsx(
                    'flex w-full items-center justify-between',
                    'h-9 px-3 rounded-lg',
                    'text-xs font-semibold uppercase tracking-wide',
                    'text-slate-500 hover:text-slate-700',
                    'transition-colors duration-200',
                    'hover:bg-slate-100'
                  )}
                  aria-expanded={isExpanded}
                >
                  {sidebarOpen && <span>{item.label}</span>}
                  {sidebarOpen && (
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={clsx(
                        'transition-transform duration-300',
                        isExpanded ? 'rotate-180' : ''
                      )}
                    />
                  )}
                </button>

                {/* Section Children */}
                {isExpanded && sidebarOpen && (
                  <div className="space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleNavigate(child.route)}
                        disabled={child.disabled}
                        className={clsx(
                          'flex h-9 w-full items-center gap-3',
                          'rounded-lg px-3',
                          'text-sm font-medium',
                          'transition-all duration-200',
                          // Active state
                          currentPage === child.id || currentPage === child.route?.split('/')[2]
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : // Disabled state
                            child.disabled
                            ? 'cursor-not-allowed opacity-50 text-slate-400'
                            : // Hover state
                              'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        )}
                        title={!sidebarOpen ? child.label : ''}
                        aria-disabled={child.disabled}
                      >
                        <child.icon size={18} strokeWidth={2} className="flex-shrink-0" />
                        {sidebarOpen && <span className="truncate">{child.label}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Regular Navigation Item
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.route)}
              className={clsx(
                'flex h-9 w-full items-center gap-3',
                'rounded-lg px-3',
                'text-sm font-medium',
                'transition-all duration-200',
                // Active state
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : // Hover state
                    'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon size={18} strokeWidth={2} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ===== LOGOUT BUTTON ===== */}
      <div className="border-t border-slate-200 px-3 py-4">
        <button
          onClick={onLogout}
          className={clsx(
            'flex items-center gap-3',
            'h-9 rounded-lg',
            'font-medium',
            'transition-all duration-200',
            'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            sidebarOpen ? 'w-full px-3' : 'w-9 justify-center'
          )}
          title={!sidebarOpen ? 'Logout' : ''}
          aria-label="Logout"
        >
          <LogOut size={18} strokeWidth={2} className="flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
