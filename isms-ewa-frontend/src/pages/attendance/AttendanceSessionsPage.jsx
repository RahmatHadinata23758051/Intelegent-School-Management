import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Lock, Unlock, Edit2, Trash2, Calendar, Search, Filter as FilterIcon, RotateCcw, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAttendanceSessions } from '../../hooks/useAttendanceSessions';
import { useClasses } from '../../hooks/useClasses';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Alert } from '../../components/common/Alert';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AttendanceSummaryCards } from '../../components/attendance/AttendanceSummaryCards';
import { AttendanceSessionForm } from '../../components/attendance/AttendanceSessionForm';
import clsx from 'clsx';

/**
 * Attendance Sessions Page - Premium Design
 * Anti AI slop: Custom layout, meaningful interactions, professional styling
 */
export const AttendanceSessionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: classesData } = useClasses({ per_page: 100 });
  
  const {
    data: sessions,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    refetch,
    create,
    update,
    delete: deleteSession,
    lock,
    unlock,
  } = useAttendanceSessions();

  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLockConfirm, setShowLockConfirm] = useState(null);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    school_class_id: '',
    is_locked: '',
    session_date_from: '',
    session_date_to: '',
  });

  const isAdmin = user?.role === 'admin';

  // Calculate summary
  const summary = {
    total_sessions: pagination.total || 0,
    today_sessions: sessions.filter(
      (s) => s.session_date === new Date().toISOString().split('T')[0]
    ).length,
    locked_sessions: sessions.filter((s) => s.is_locked).length,
    incomplete_sessions: sessions.filter((s) => !s.is_locked && s.attendance_count < s.student_count)
      .length,
  };

  // Fetch sessions on mount and filter change
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    updateParams(filters);
  }, [filters, updateParams]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      school_class_id: '',
      is_locked: '',
      session_date_from: '',
      session_date_to: '',
    });
    updateParams({
      search: '',
      school_class_id: '',
      is_locked: '',
      session_date_from: '',
      session_date_to: '',
    });
  }, [updateParams]);

  const handleCreate = () => {
    setEditingSession(null);
    setShowForm(true);
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSession) {
        await update(editingSession.id, formData);
        setSuccessMessage('Sesi absensi berhasil diperbarui');
      } else {
        await create(formData);
        setSuccessMessage('Sesi absensi berhasil dibuat');
      }
      setShowForm(false);
      setEditingSession(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setIsSubmitting(true);
    try {
      await deleteSession(showDeleteConfirm.id);
      setSuccessMessage('Sesi absensi berhasil dihapus');
      setShowDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLock = async () => {
    if (!showLockConfirm) return;
    setIsSubmitting(true);
    try {
      await lock(showLockConfirm.id);
      setSuccessMessage('Sesi absensi berhasil dikunci');
      setShowLockConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlock = async () => {
    if (!showUnlockConfirm) return;
    setIsSubmitting(true);
    try {
      await unlock(showUnlockConfirm.id);
      setSuccessMessage('Sesi absensi berhasil dibuka');
      setShowUnlockConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && sessions.length === 0) {
    return <LoadingScreen message="Memuat sesi absensi..." />;
  }

  return (
    <AppLayout currentPage="attendance-sessions">
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
          <h1 className="text-3xl font-bold text-slate-900">Sesi Absensi</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola sesi absensi harian berdasarkan kelas dan tanggal
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Buat Sesi Absensi
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-6">
        <AttendanceSummaryCards summary={summary} />
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kelas atau catatan..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Class Filter */}
          <select
            value={filters.school_class_id}
            onChange={(e) => handleFilterChange('school_class_id', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Semua Kelas</option>
            {classesData?.data?.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Lock Status Filter */}
          <select
            value={filters.is_locked}
            onChange={(e) => handleFilterChange('is_locked', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Semua Status</option>
            <option value="1">Terkunci</option>
            <option value="0">Belum Terkunci</option>
          </select>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <FilterIcon size={16} />
              Filter
            </button>
            <button
              onClick={clearFilters}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              title="Reset filter"
            >
              <RotateCcw size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <ErrorState title="Gagal memuat sesi absensi" message={error} onRetry={refetch} />
      )}

      {/* Sessions Table */}
      {!error && (
        <>
          {sessions.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Belum ada sesi absensi"
              description="Buat sesi absensi pertama untuk mulai mencatat kehadiran siswa"
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Kelas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Tahun Ajaran
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Kehadiran
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {new Date(session.session_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {session.school_class?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {session.academic_year?.year}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          Semester {session.semester?.semester_number}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {session.is_locked ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                              <Lock size={14} />
                              Terkunci
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700">
                              <Unlock size={14} />
                              Terbuka
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {session.attendance_count || 0} / {session.student_count || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/attendance/sessions/${session.id}/input`)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                              title="Input Absensi"
                            >
                              <Eye size={16} strokeWidth={1.5} />
                            </button>
                            {!session.is_locked && isAdmin && (
                              <>
                                <button
                                  onClick={() => handleEdit(session)}
                                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                                  title="Edit"
                                >
                                  <Edit2 size={16} strokeWidth={1.5} />
                                </button>
                                <button
                                  onClick={() => setShowLockConfirm(session)}
                                  className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                                  title="Kunci Sesi"
                                >
                                  <Lock size={16} strokeWidth={1.5} />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(session)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                  title="Hapus"
                                >
                                  <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                              </>
                            )}
                            {session.is_locked && isAdmin && (
                              <button
                                onClick={() => setShowUnlockConfirm(session)}
                                className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-600"
                                title="Buka Kunci"
                              >
                                <Unlock size={16} strokeWidth={1.5} />
                              </button>
                            )}
                          </div>
                        </td>
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

      {/* Form Modal */}
      {showForm && (
        <AttendanceSessionForm
          session={editingSession}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingSession(null);
          }}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Sesi Absensi"
        message={`Apakah Anda yakin ingin menghapus sesi absensi untuk kelas ${showDeleteConfirm?.school_class?.name} pada tanggal ${showDeleteConfirm?.session_date}?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={isSubmitting}
      />

      {/* Lock Confirmation */}
      <ConfirmDialog
        isOpen={!!showLockConfirm}
        onClose={() => setShowLockConfirm(null)}
        onConfirm={handleLock}
        title="Kunci Sesi Absensi"
        message="Setelah dikunci, sesi absensi tidak dapat diubah lagi. Lanjutkan?"
        confirmLabel="Kunci"
        cancelLabel="Batal"
        variant="primary"
        loading={isSubmitting}
      />

      {/* Unlock Confirmation */}
      <ConfirmDialog
        isOpen={!!showUnlockConfirm}
        onClose={() => setShowUnlockConfirm(null)}
        onConfirm={handleUnlock}
        title="Buka Kunci Sesi Absensi"
        message="Sesi absensi akan dapat diubah kembali. Lanjutkan?"
        confirmLabel="Buka Kunci"
        cancelLabel="Batal"
        variant="warning"
        loading={isSubmitting}
      />
    </AppLayout>
  );
};
