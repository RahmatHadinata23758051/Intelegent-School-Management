import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Users,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { AppLayout } from '../../components/layout/AppLayout';
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: statistics, loading, error, refetch } = useDashboardStats(isAuthenticated && !authLoading);
  const [partialError, setPartialError] = useState(null);

  console.log('[DashboardPage] Rendering, isAuthenticated:', isAuthenticated, 'authLoading:', authLoading, 'loading:', loading, 'statistics:', statistics);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('[DashboardPage] Not authenticated, redirecting to login');
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
    console.log('[DashboardPage] Still loading... authLoading:', authLoading, 'loading:', loading);
    return <LoadingScreen message="Loading dashboard..." />;
  }

  console.log('[DashboardPage] Rendering dashboard with data:', statistics);

  return (
    <AppLayout currentPage="dashboard">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to ISMS-EWA</h2>
        <p className="text-blue-100">Monitor student performance and risk levels in real-time</p>
      </div>

      {/* KPI Cards Grid */}
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

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <Card.Body className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4">
              <Users size={28} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">Safe Students</p>
            <p className="text-3xl font-bold text-emerald-600">{statistics?.risk_distribution?.safe || 0}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-xl mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">Warning Students</p>
            <p className="text-3xl font-bold text-amber-600">{statistics?.risk_distribution?.warning || 0}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-xl mb-4">
              <AlertTriangle size={28} className="text-rose-600" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">High Risk Students</p>
            <p className="text-3xl font-bold text-rose-600">{statistics?.risk_distribution?.high_risk || 0}</p>
          </Card.Body>
        </Card>
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
          <div className="space-y-6">
            {[
              { label: 'Safe', value: statistics?.risk_distribution?.safe || 0, color: 'emerald' },
              { label: 'Warning', value: statistics?.risk_distribution?.warning || 0, color: 'amber' },
              { label: 'High Risk', value: statistics?.risk_distribution?.high_risk || 0, color: 'rose' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'text-lg font-bold',
                      item.color === 'emerald' && 'text-emerald-600',
                      item.color === 'amber' && 'text-amber-600',
                      item.color === 'rose' && 'text-rose-600'
                    )}>
                      {item.value}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({((item.value / (statistics?.total_students || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
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

      {/* High Risk Students & Recent Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Risk Students */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">High Risk Students</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.STUDENTS)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                View All <ArrowRight size={16} />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {statistics?.high_risk_students && statistics.high_risk_students.length > 0 ? (
              <div className="space-y-3">
                {statistics.high_risk_students.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.student_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-rose-600">{parseFloat(student.risk_score?.total_score || 0).toFixed(2)}</p>
                      <RiskBadge level="high_risk" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-emerald-600" />
                </div>
                <p className="text-slate-500 font-medium">No high risk students</p>
                <p className="text-xs text-slate-400 mt-1">All students are performing well</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Recent Violations */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Violations</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.STUDENTS)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                View All <ArrowRight size={16} />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {statistics?.recent_violations && statistics.recent_violations.length > 0 ? (
              <div className="space-y-3">
                {statistics.recent_violations.slice(0, 5).map((violation) => (
                  <div key={violation.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{violation.student?.name || 'Student'}</p>
                      <p className="text-sm text-slate-600 mt-1">{violation.description || 'Violation'}</p>
                      <p className="text-xs text-slate-400 mt-2">{violation.created_at || 'Date'}</p>
                    </div>
                    <AlertTriangle size={20} className="text-rose-500 flex-shrink-0 ml-3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={24} className="text-emerald-600" />
                </div>
                <p className="text-slate-500 font-medium">No recent violations</p>
                <p className="text-xs text-slate-400 mt-1">Great behavior from all students</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-8">
          <ErrorState
            title="Failed to load dashboard"
            message={error}
            onRetry={refetch}
          />
        </div>
      )}
    </AppLayout>
  );
};
