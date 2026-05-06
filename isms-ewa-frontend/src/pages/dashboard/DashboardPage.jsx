import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  BarChart3,
  Users,
  AlertTriangle,
  BookOpen,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { IconBadge } from '../../components/common/IconBadge';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ROUTES } from '../../constants/routes';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: statistics, loading, error, refetch } = useDashboardStats();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <span className="font-bold text-slate-900">ISMS-EWA</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {[
              { icon: BarChart3, label: 'Dashboard', route: ROUTES.DASHBOARD, active: true },
              { icon: Users, label: 'Students', route: ROUTES.STUDENTS },
              { icon: BookOpen, label: 'Classes', route: ROUTES.CLASSES },
              { icon: AlertTriangle, label: 'Risk Monitoring', route: null, disabled: true },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => item.route && navigate(item.route)}
                disabled={item.disabled}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-3 border-t border-slate-200 space-y-3">
            {sidebarOpen && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-600">Logged in as</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut size={18} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={clsx('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <ErrorState
              title="Failed to load dashboard"
              message={error}
              onRetry={refetch}
            />
          )}

          {!error && (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Students"
                  value={statistics?.total_students || 0}
                  description="Active students in system"
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Total Classes"
                  value={statistics?.total_classes || 0}
                  description="Classes with students"
                  icon={BookOpen}
                  color="indigo"
                />
                <StatCard
                  title="Total Grades"
                  value={statistics?.total_grades || 0}
                  description="Recorded grades"
                  icon={TrendingUp}
                  color="emerald"
                />
                <StatCard
                  title="Total Violations"
                  value={statistics?.total_violations || 0}
                  description="Recorded violations"
                  icon={AlertTriangle}
                  color="rose"
                />
              </div>

              {/* Risk Distribution */}
              <Card className="mb-8">
                <Card.Header>
                  <div className="flex items-center gap-3">
                    <IconBadge icon={AlertTriangle} color="amber" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Risk Distribution</h3>
                      <p className="text-sm text-slate-500">Student risk level breakdown</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {[
                      { label: 'Safe', value: statistics?.risk_distribution?.safe || 0, color: 'emerald' },
                      { label: 'Warning', value: statistics?.risk_distribution?.warning || 0, color: 'amber' },
                      { label: 'High Risk', value: statistics?.risk_distribution?.high_risk || 0, color: 'rose' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-600">{item.label}</span>
                          <span className={clsx(
                            'text-sm font-bold',
                            item.color === 'emerald' && 'text-emerald-600',
                            item.color === 'amber' && 'text-amber-600',
                            item.color === 'rose' && 'text-rose-600'
                          )}>
                            {item.value}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full rounded-full',
                              item.color === 'emerald' && 'bg-emerald-500',
                              item.color === 'amber' && 'bg-amber-500',
                              item.color === 'rose' && 'bg-rose-500'
                            )}
                            style={{
                              width: `${(item.value / (statistics?.total_students || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* High Risk Students */}
              <Card className="mb-8">
                <Card.Header>
                  <h3 className="text-lg font-semibold text-slate-900">High Risk Students</h3>
                </Card.Header>
                <Card.Body>
                  {statistics?.high_risk_students && statistics.high_risk_students.length > 0 ? (
                    <div className="space-y-3">
                      {statistics.high_risk_students.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/students/${student.id}`)}
                        >
                          <div>
                            <p className="font-medium text-slate-900">{student.name}</p>
                            <p className="text-sm text-slate-500">{student.student_id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-rose-600">{student.risk_score?.total_score?.toFixed(2) || 0}</p>
                            <RiskBadge level="high_risk" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No high risk students</p>
                  )}
                </Card.Body>
              </Card>

              {/* Recent Violations */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Violations</h3>
                </Card.Header>
                <Card.Body>
                  {statistics?.recent_violations && statistics.recent_violations.length > 0 ? (
                    <div className="space-y-3">
                      {statistics.recent_violations.slice(0, 5).map((violation) => (
                        <div key={violation.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{violation.student?.name || 'Student'}</p>
                            <p className="text-sm text-slate-500">{violation.description || 'Violation'}</p>
                          </div>
                          <p className="text-xs text-slate-500">{violation.created_at || 'Date'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No recent violations</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
