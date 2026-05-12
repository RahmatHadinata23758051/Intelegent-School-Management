import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClassSubjects } from '../../hooks/useClassSubjects';
import { useClasses } from '../../hooks/useClasses';
import { useSubjects } from '../../hooks/useSubjects';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { StatusPill } from '../../components/design-system';
import { ClassSubjectForm } from '../../components/class-subjects/ClassSubjectForm';
import { Plus, Edit2, Trash2, Search, X, RotateCcw, BookOpen, CheckCircle2, Layers, Grid3x3 } from 'lucide-react';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ClassSubjectsPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    classSubjects,
    loading,
    error,
    pagination,
    fetchClassSubjects,
    createClassSubject,
    updateClassSubject,
    deleteClassSubject,
    setPaginationParams,
    initialize,
    hasInitialized,
  } = useClassSubjects();

  const { data: classesData } = useClasses();
  const { data: subjectsData } = useSubjects();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Debounce search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const isAdmin = user?.role === 'admin';

  // Memoize expensive calculations
  const schoolClasses = useMemo(() => classesData?.data || [], [classesData?.data]);
  const subjects = useMemo(() => subjectsData || [], [subjectsData]);

  // Memoize summary stats
  const summaryStats = useMemo(() => {
    // Use pagination.total for total assignments
    const total = pagination?.total || 0;
    const active = classSubjects.filter((cs) => cs.is_active).length;
    const uniqueClasses = classSubjects.length > 0 
      ? new Set(classSubjects.map((cs) => cs.school_class_id)).size 
      : 0;
    const uniqueSubjects = classSubjects.length > 0
      ? new Set(classSubjects.map((cs) => cs.subject_id)).size
      : 0;

    return {
      totalAssignments: total,
      activeAssignments: active,
      uniqueClasses,
      uniqueSubjects,
    };
  }, [pagination?.total, classSubjects]);

  // Initialize fetch when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasInitialized) {
      initialize();
    }
  }, [isAuthenticated, authLoading, hasInitialized, initialize]);

  // Update search params only when debounced value changes
  useEffect(() => {
    if (!hasInitialized || authLoading) return;
    
    const params = {
      page: pagination.current_page,
      per_page: pagination.per_page,
      search: debouncedSearchTerm,
      school_class_id: filterClass ? parseInt(filterClass) : undefined,
      subject_id: filterSubject ? parseInt(filterSubject) : undefined,
      status: filterStatus,
    };

    fetchClassSubjects(params);
  }, [
    debouncedSearchTerm,
    filterClass,
    filterSubject,
    filterStatus,
    fetchClassSubjects,
    hasInitialized,
    authLoading,
  ]);

  // Optimized handlers with useCallback
  const handleOpenModal = useCallback((item = null) => {
    setEditingItem(item);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingItem(null);
  }, []);

  const handleSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateClassSubject(editingItem.id, formData);
      } else {
        await createClassSubject(formData);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  }, [editingItem, updateClassSubject, createClassSubject, handleCloseModal]);

  const handleDelete = useCallback(async (id) => {
    setIsSubmitting(true);
    try {
      await deleteClassSubject(id);
      setShowDeleteConfirm(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [deleteClassSubject]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterClass('');
    setFilterSubject('');
    setFilterStatus('all');
  }, []);

  if (loading && classSubjects.length === 0) {
    return <LoadingScreen message="Memuat data assignment mapel kelas..." />;
  }

  if (error && classSubjects.length === 0) {
    return (
      <AppLayout currentPage="class-subjects">
        <ErrorState message={error} />
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPage="class-subjects">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignment Mapel Kelas</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola penugasan mata pelajaran ke kelas</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Tambah Assignment
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Assignment</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{summaryStats.totalAssignments}</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua penugasan</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-100">
              <BookOpen size={20} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Assignment Aktif</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{summaryStats.activeAssignments}</p>
              <p className="text-xs text-slate-500 mt-0.5">Sedang berlangsung</p>
            </div>
            <div className="p-2.5 rounded-lg bg-green-100">
              <CheckCircle2 size={20} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Kelas dengan Mapel</p>
              <p className="mt-2 text-2xl font-bold text-purple-600">{summaryStats.uniqueClasses}</p>
              <p className="text-xs text-slate-500 mt-0.5">Kelas terisi</p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-100">
              <Grid3x3 size={20} className="text-purple-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Mapel Terpakai</p>
              <p className="mt-2 text-2xl font-bold text-orange-600">{summaryStats.uniqueSubjects}</p>
              <p className="text-xs text-slate-500 mt-0.5">Mapel aktif</p>
            </div>
            <div className="p-2.5 rounded-lg bg-orange-100">
              <Layers size={20} className="text-orange-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kelas atau mapel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Filter Class */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
          >
            <option value="">Semua Kelas</option>
            {schoolClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Filter Subject */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
          >
            <option value="">Semua Mapel</option>
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.code} - {subj.name}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={() => fetchClassSubjects()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Refresh data"
            >
              <RotateCcw size={18} strokeWidth={1.5} />
            </button>

            {/* Clear Filters */}
            {(searchTerm || filterClass || filterSubject || filterStatus !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Mata Pelajaran</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Dibuat</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Aksi</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {classSubjects.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <BookOpen size={48} className="text-slate-300 mb-3" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-slate-600">Tidak ada data assignment</p>
                      <p className="text-xs text-slate-500 mt-1">Silakan tambah assignment baru atau ubah filter pencarian</p>
                    </div>
                  </td>
                </tr>
              ) : (
                classSubjects.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.school_class?.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <span className="font-medium text-slate-900">{item.subject?.code}</span>
                      <span className="text-slate-500"> - {item.subject?.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusPill status={item.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(item)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
            <p className="text-sm text-slate-600">
              Halaman <span className="font-medium">{pagination.current_page}</span> dari <span className="font-medium">{pagination.last_page}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginationParams({ current_page: pagination.current_page - 1 })}
                disabled={pagination.current_page === 1}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPaginationParams({ current_page: pagination.current_page + 1 })}
                disabled={pagination.current_page === pagination.last_page}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Form Modal */}
      <ClassSubjectForm
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingItem}
        isLoading={isSubmitting}
        schoolClasses={schoolClasses}
        subjects={subjects}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Hapus Assignment</h3>
              <p className="text-sm text-slate-600">
                Apakah Anda yakin ingin menghapus assignment ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};

export default ClassSubjectsPage;
