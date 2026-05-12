import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Users,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Calendar,
  Download,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  Activity,
  Award,
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
import { KpiCard, StatusPill, SelectControl } from '../../components/design-system';
import { ROUTES } from '../../constants/routes';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: statistics, loading, error, refetch } = useDashboardStats(isAuthenticated && !authLoading);
  const [partialError, setPartialError] = useState(null);

  // Redirect if not authenticated
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
      {/* Top Controls - Academic Year & Export */}
      <div className="mb-6 flex justify-end gap-3">
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-[#FAFBFD] px-4 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50">
          <Calendar size={17} />
          Tahun Ajaran 2024/2025
          <ChevronDown size={16} />
        </button>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-[#FAFBFD] px-4 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50">
          <Download size={17} />
          Export Laporan
        </button>
      </div>

      {/* KPI Cards Grid - 4 columns */}
      <div className="mb-4 grid grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          title="Total Siswa"
          meta="Aktif"
          value={statistics?.total_students || '0'}
          change="▲ 5,2% dari bulan lalu"
          tone="blue"
        />
        <KpiCard
          icon={BookOpen}
          title="Total Kelas"
          meta="Aktif"
          value={statistics?.total_classes || '0'}
          change="▲ 2 kelas dari bulan lalu"
          tone="purple"
        />
        <KpiCard
          icon={TrendingUp}
          title="Total Nilai"
          meta="Tercatat"
          value={statistics?.total_grades || '0'}
          change="▲ 8,7% dari bulan lalu"
          tone="green"
        />
        <KpiCard
          icon={AlertTriangle}
          title="Total Pelanggaran"
          meta="Tercatat"
          value={statistics?.total_violations || '0'}
          change="▲ 12 dari bulan lalu"
          tone="rose"
        />
      </div>

      {/* Risk Distribution & Student Attention - 2 column grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Risk Distribution */}
        <Card className="overflow-hidden">
          <div className="flex items-start justify-between p-6">
            <div>
              <h2 className="text-[16px] font-medium leading-6 text-slate-950">Distribusi Risiko</h2>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">Ringkasan tingkat risiko siswa saat ini.</p>
            </div>
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50">
              Semua Kelas
              <ChevronDown size={15} />
            </button>
          </div>
          <div className="px-6 pb-6">
            {/* Risk Bar */}
            <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="bg-emerald-500" style={{ width: '61%' }} />
              <div className="bg-amber-400" style={{ width: '25%' }} />
              <div className="bg-rose-500" style={{ width: '10%' }} />
              <div className="bg-red-700" style={{ width: '4%' }} />
            </div>

            {/* Risk Legend */}
            <div className="mt-6 grid grid-cols-4 divide-x divide-slate-200">
              {[
                { label: 'Aman', value: statistics?.risk_distribution?.safe || 0, dot: 'bg-emerald-500' },
                { label: 'Waspada', value: statistics?.risk_distribution?.warning || 0, dot: 'bg-amber-400' },
                { label: 'Risiko Tinggi', value: statistics?.risk_distribution?.high_risk || 0, dot: 'bg-rose-500' },
                { label: 'Kritis', value: 44, dot: 'bg-red-700' },
              ].map((item) => (
                <div key={item.label} className="px-5 first:pl-0">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <span className={clsx('h-2.5 w-2.5 rounded-full', item.dot)} />
                    {item.label}
                  </div>
                  <div className="mt-4 text-[28px] font-bold leading-7 tracking-[-0.02em] text-slate-950 tabular-nums">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[13px] leading-5 text-slate-500">
                    {((item.value / (statistics?.total_students || 1)) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-14 items-center justify-between border-t border-slate-200 px-6 text-[14px] font-medium text-blue-600 transition hover:bg-slate-50 cursor-pointer">
            Lihat analitik risiko secara lengkap
            <ChevronRight size={17} />
          </div>
        </Card>

        {/* Students Needing Attention */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-medium leading-6 text-slate-950">Siswa yang Perlu Perhatian</h2>
            <button className="text-[13px] font-medium text-blue-600 transition hover:text-blue-700">
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {statistics?.high_risk_students && statistics.high_risk_students.length > 0 ? (
              statistics.high_risk_students.slice(0, 4).map((student) => (
                <div key={student.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className={clsx(
                    'grid h-10 w-10 place-items-center rounded-full text-[13px] font-medium',
                    student.risk_score?.total_score > 70 ? 'bg-rose-50 text-rose-600' :
                    student.risk_score?.total_score > 50 ? 'bg-orange-50 text-orange-600' :
                    'bg-amber-50 text-amber-700'
                  )}>
                    {student.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium leading-5 text-slate-950">{student.name}</div>
                    <div className="text-[13px] leading-5 text-slate-500">{student.class_name || 'Kelas'}</div>
                  </div>
                  <StatusPill status={student.risk_score?.total_score > 70 ? 'Kritis' : 'Risiko Tinggi'} />
                  <div className="w-20 text-[13px] leading-5 text-slate-500">
                    Pelanggaran
                    <div className="font-medium text-slate-800">{student.violations_count || 0}</div>
                  </div>
                  <ChevronRight size={17} className="text-slate-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 font-medium">Tidak ada siswa berisiko tinggi</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Activity & Quick Actions - 2 column grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card className="overflow-hidden">
          <div className="p-6 pb-2">
            <h2 className="text-[16px] font-medium leading-6 text-slate-950">Aktivitas Terbaru</h2>
          </div>
          <div className="px-6 pb-4">
            {statistics?.recent_violations && statistics.recent_violations.length > 0 ? (
              statistics.recent_violations.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 border-b border-dashed border-slate-200 py-3 last:border-0">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-blue-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium leading-5 text-slate-900">
                      Pelanggaran baru dicatat untuk {activity.student?.name}
                    </div>
                    <div className="text-[12px] leading-5 text-slate-500">{activity.student?.class_name}</div>
                  </div>
                  <div className="text-[12px] text-slate-500">Baru saja</div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">Tidak ada aktivitas terbaru</p>
              </div>
            )}
          </div>
          <div className="flex h-12 items-center justify-end gap-2 border-t border-slate-200 px-6 text-[13px] font-medium text-blue-600 transition hover:bg-slate-50 cursor-pointer">
            Lihat semua aktivitas
            <ChevronRight size={16} />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-[16px] font-medium leading-6 text-slate-950">Aksi Cepat</h2>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: 'Tambah Siswa', tone: 'text-blue-600' },
              { icon: AlertTriangle, label: 'Catat Pelanggaran', tone: 'text-rose-600' },
              { icon: BookOpen, label: 'Input Nilai', tone: 'text-emerald-600' },
              { icon: Users, label: 'Buat Kelas', tone: 'text-violet-600' },
              { icon: Calendar, label: 'Tambah Semester', tone: 'text-blue-600' },
              { icon: TrendingUp, label: 'Laporan Risiko', tone: 'text-orange-600' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex h-20 items-center gap-4 rounded-lg border border-slate-200 bg-[#FAFBFD] px-5 text-left text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon size={25} className={action.tone} strokeWidth={2} />
                  {action.label}
                </button>
              );
            })}
          </div>
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
