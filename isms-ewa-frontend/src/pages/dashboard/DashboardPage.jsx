import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Users,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  Calendar,
  Download,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { KpiCard, StatusPill } from '../../components/design-system';
import { ROUTES } from '../../constants/routes';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: statistics, loading, error, refetch } = useDashboardStats(isAuthenticated && !authLoading);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <AppLayout currentPage="dashboard">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Ringkasan sistem dan statistik sekolah</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Siswa</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{statistics?.total_students || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Siswa terdaftar</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-100">
              <Users size={20} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Kelas</p>
              <p className="mt-2 text-2xl font-bold text-purple-600">{statistics?.total_classes || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Kelas aktif</p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-100">
              <BookOpen size={20} className="text-purple-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Nilai</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{statistics?.total_grades || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Nilai tercatat</p>
            </div>
            <div className="p-2.5 rounded-lg bg-green-100">
              <TrendingUp size={20} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-red-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Pelanggaran</p>
              <p className="mt-2 text-2xl font-bold text-red-600">{statistics?.total_violations || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Pelanggaran tercatat</p>
            </div>
            <div className="p-2.5 rounded-lg bg-red-100">
              <AlertTriangle size={20} className="text-red-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Distribution & Student Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Risk Distribution */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">Distribusi Risiko</h2>
            <p className="text-sm text-slate-600 mt-0.5">Tingkat risiko siswa</p>
          </div>
          <div className="p-4">
            {/* Risk Bar */}
            <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 mb-4">
              <div className="bg-emerald-500" style={{ width: `${((statistics?.risk_distribution?.safe || 0) / (statistics?.total_students || 1) * 100)}%` }} />
              <div className="bg-amber-400" style={{ width: `${((statistics?.risk_distribution?.warning || 0) / (statistics?.total_students || 1) * 100)}%` }} />
              <div className="bg-rose-500" style={{ width: `${((statistics?.risk_distribution?.high_risk || 0) / (statistics?.total_students || 1) * 100)}%` }} />
            </div>

            {/* Risk Legend */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Aman', value: statistics?.risk_distribution?.safe || 0, color: 'bg-emerald-500' },
                { label: 'Waspada', value: statistics?.risk_distribution?.warning || 0, color: 'bg-amber-400' },
                { label: 'Risiko Tinggi', value: statistics?.risk_distribution?.high_risk || 0, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={clsx('h-3 w-3 rounded-full', item.color)} />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Students Needing Attention */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Siswa Perlu Perhatian</h2>
              <p className="text-sm text-slate-600 mt-0.5">Siswa dengan risiko tinggi</p>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {statistics?.high_risk_students && statistics.high_risk_students.length > 0 ? (
              statistics.high_risk_students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
                  <div className={clsx(
                    'grid h-9 w-9 place-items-center rounded-full text-sm font-medium',
                    student.risk_score?.total_score > 70 ? 'bg-rose-100 text-rose-700' :
                    student.risk_score?.total_score > 50 ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    {student.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-600">{student.class_name || 'Kelas'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600">Pelanggaran</p>
                    <p className="text-sm font-bold text-slate-900">{student.violations_count || 0}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">Tidak ada siswa berisiko tinggi</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Aktivitas Terbaru</h2>
          <p className="text-sm text-slate-600 mt-0.5">Pelanggaran dan aktivitas sistem</p>
        </div>
        <div className="divide-y divide-slate-200">
          {statistics?.recent_violations && statistics.recent_violations.length > 0 ? (
            statistics.recent_violations.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle size={16} className="text-red-600" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Pelanggaran: {activity.student?.name}
                  </p>
                  <p className="text-xs text-slate-600">{activity.student?.class_name}</p>
                </div>
                <p className="text-xs text-slate-500">Baru saja</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">Tidak ada aktivitas terbaru</p>
            </div>
          )}
        </div>
      </Card>

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
