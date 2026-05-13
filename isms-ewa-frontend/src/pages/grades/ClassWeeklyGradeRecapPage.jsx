import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWeeklyGradeRecap } from '../../hooks/useWeeklyGradeRecap';
import { useClasses } from '../../hooks/useClasses';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ScoreBadge } from '../../components/grades/ScoreBadge';
import clsx from 'clsx';

/**
 * Class Weekly Grade Recap Page
 * View weekly grade recap per class
 */
export const ClassWeeklyGradeRecapPage = () => {
  const { user } = useAuth();
  const { data: classesData, initialize: initClasses, hasInitialized: classesInitialized } = useClasses({ per_page: 100 });
  const { classRecap, loading, error, fetchClassRecap } = useWeeklyGradeRecap();

  const [selectedClass, setSelectedClass] = useState('');

  // Initialize classes
  useEffect(() => {
    if (!classesInitialized) {
      initClasses();
    }
  }, [classesInitialized, initClasses]);

  // Fetch recap when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchClassRecap(selectedClass);
    }
  }, [selectedClass, fetchClassRecap]);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  if (!classesInitialized) {
    return <LoadingScreen message="Memuat data..." />;
  }

  const classes = classesData?.data || [];

  return (
    <AppLayout currentPage="grade-recap">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Rekap Nilai Kelas</h1>
        <p className="mt-1 text-sm text-slate-600">
          Lihat rekap nilai mingguan per kelas dan per siswa
        </p>
      </div>

      {/* Class Selection */}
      <Card className="mb-6 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Pilih Kelas
        </label>
        <select
          value={selectedClass}
          onChange={(e) => handleClassChange(e.target.value)}
          className="w-full md:w-96 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Pilih kelas untuk melihat rekap</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
            <p className="text-sm text-slate-600">Memuat rekap nilai...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorState title="Gagal memuat rekap nilai" message={error} onRetry={() => fetchClassRecap(selectedClass)} />
      )}

      {/* Empty State */}
      {!selectedClass && !loading && !error && (
        <EmptyState
          icon={Users}
          title="Pilih Kelas"
          description="Pilih kelas untuk melihat rekap nilai mingguan siswa"
        />
      )}

      {/* Recap Data */}
      {selectedClass && classRecap && !loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-5 border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Rata-rata Kelas</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {classRecap.class_average_score?.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50">
                  <TrendingUp className="text-blue-600" size={20} strokeWidth={2} />
                </div>
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-emerald-500">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Siswa</p>
                  <p className="text-2xl font-bold text-slate-900">{classRecap.total_students || 0}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <Users className="text-emerald-600" size={20} strokeWidth={2} />
                </div>
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-amber-500">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Nilai</p>
                  <p className="text-2xl font-bold text-slate-900">{classRecap.total_records || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-rose-500">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Siswa Nilai Rendah</p>
                  <p className="text-2xl font-bold text-slate-900">{classRecap.low_score_students_count || 0}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50">
                  <AlertTriangle className="text-rose-600" size={20} strokeWidth={2} />
                </div>
              </div>
            </Card>
          </div>

          {/* Students Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Rekap Per Siswa</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Nama Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Rata-rata
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Min
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Max
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Total Nilai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Nilai Rendah
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {classRecap.students?.map((student, index) => {
                    const isLowPerformer = student.average_score < 70;
                    
                    return (
                      <tr
                        key={student.student_id}
                        className={clsx(
                          'hover:bg-slate-50 transition-colors',
                          isLowPerformer && 'bg-rose-50/30'
                        )}
                      >
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {student.student_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {student.student_number}
                        </td>
                        <td className="px-6 py-4">
                          <ScoreBadge score={student.average_score} size="sm" showLabel={false} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {student.min_score?.toFixed(1) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {student.max_score?.toFixed(1) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {student.total_records || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {student.low_score_count || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </AppLayout>
  );
};
