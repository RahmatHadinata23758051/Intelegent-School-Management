import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWeeklyGrades } from '../../hooks/useWeeklyGrades';
import { useWeeklyGradeRecap } from '../../hooks/useWeeklyGradeRecap';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Alert } from '../../components/common/Alert';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { WeeklyGradeSummaryCards } from '../../components/grades/WeeklyGradeSummaryCards';
import { ScoreBadge } from '../../components/grades/ScoreBadge';
import { GradeComponentBadge } from '../../components/grades/GradeComponentBadge';

/**
 * Weekly Grades Page
 * List and manage weekly grades
 */
export const WeeklyGradesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    data: grades,
    loading,
    error,
    pagination,
    goToPage,
    refetch,
    delete: deleteGrade,
    initialize,
    hasInitialized,
  } = useWeeklyGrades();

  const { summary, fetchSummary } = useWeeklyGradeRecap();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAdmin = user?.role === 'admin';

  // Initialize on mount
  useEffect(() => {
    if (!hasInitialized) {
      initialize();
    }
    fetchSummary();
  }, [hasInitialized, initialize, fetchSummary]);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setIsSubmitting(true);
    try {
      await deleteGrade(showDeleteConfirm.id);
      setSuccessMessage('Nilai berhasil dihapus');
      setShowDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && grades.length === 0) {
    return <LoadingScreen message="Memuat nilai mingguan..." />;
  }

  return (
    <AppLayout currentPage="weekly-grades">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6">
          <Alert type="success" title="Berhasil" message={successMessage} onClose={() => setSuccessMessage('')} />
        </div>
      )}
      {errorMessage && (
        <div className="mb-6">
          <Alert type="error" title="Error" message={errorMessage} onClose={() => setErrorMessage('')} />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nilai Mingguan</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola input nilai mingguan siswa berdasarkan kelas dan mata pelajaran
          </p>
        </div>
        <button
          onClick={() => navigate('/grades/weekly/input')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={2} />
          Input Nilai Mingguan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6">
        <WeeklyGradeSummaryCards
          totalRecords={summary?.total_records || 0}
          averageScore={summary?.average_score || 0}
          lowScoreCount={summary?.low_score_count || 0}
          totalStudents={summary?.total_students || 0}
          loading={!summary}
        />
      </div>

      {/* Error State */}
      {error && (
        <ErrorState title="Gagal memuat nilai mingguan" message={error} onRetry={refetch} />
      )}

      {/* Grades Table */}
      {!error && (
        <>
          {grades.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Belum ada nilai mingguan"
              description="Mulai dengan memilih kelas dan mata pelajaran untuk input nilai"
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Siswa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Kelas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Mata Pelajaran
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Komponen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Minggu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Nilai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      {isAdmin && (
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Aksi
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {grades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {grade.student?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {grade.teacher_subject_assignment?.class_subject?.school_class?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {grade.teacher_subject_assignment?.class_subject?.subject?.name}
                        </td>
                        <td className="px-6 py-4">
                          <GradeComponentBadge
                            code={grade.grade_component?.code}
                            name={grade.grade_component?.name}
                            size="sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          Minggu {grade.week_number}
                        </td>
                        <td className="px-6 py-4">
                          <ScoreBadge score={grade.score} size="sm" showLabel={false} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {grade.assessment_date
                            ? new Date(grade.assessment_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setShowDeleteConfirm(grade)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                title="Hapus"
                              >
                                <Trash2 size={16} strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
                  <p className="text-sm text-slate-600">
                    Halaman <span className="font-medium">{pagination.current_page}</span> dari{' '}
                    <span className="font-medium">{pagination.last_page}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPage(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => goToPage(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Nilai"
        message={`Apakah Anda yakin ingin menghapus nilai ${showDeleteConfirm?.student?.name}?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={isSubmitting}
      />
    </AppLayout>
  );
};
