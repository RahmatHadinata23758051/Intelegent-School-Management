import { useState, useEffect } from 'react';
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
import { Plus, Edit2, Trash2, Search, X, RotateCcw } from 'lucide-react';

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
  } = useClassSubjects();

  const { data: classesData } = useClasses();
  const { data: subjectsData } = useSubjects();

  const schoolClasses = classesData?.data || [];
  const subjects = subjectsData || [];

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasInitialized, setHasInitialized] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Calculate summary stats
  const totalAssignments = pagination.total;
  const activeAssignments = classSubjects.filter((cs) => cs.is_active).length;
  const uniqueClasses = new Set(classSubjects.map((cs) => cs.school_class_id)).size;
  const uniqueSubjects = new Set(classSubjects.map((cs) => cs.subject_id)).size;

  // Initialize fetch when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasInitialized) {
      setHasInitialized(true);
      fetchClassSubjects();
    }
  }, [isAuthenticated, authLoading, hasInitialized, fetchClassSubjects]);

  // Fetch data when filters change
  useEffect(() => {
    if (!hasInitialized || authLoading) return;

    const params = {
      page: pagination.current_page,
      per_page: pagination.per_page,
      search: searchTerm,
      school_class_id: filterClass ? parseInt(filterClass) : undefined,
      subject_id: filterSubject ? parseInt(filterSubject) : undefined,
      status: filterStatus,
    };

    fetchClassSubjects(params);
  }, [
    pagination.current_page,
    pagination.per_page,
    searchTerm,
    filterClass,
    filterSubject,
    filterStatus,
    fetchClassSubjects,
    hasInitialized,
    authLoading,
  ]);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (formData) => {
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
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteClassSubject(id);
      setShowDeleteConfirm(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterSubject('');
    setFilterStatus('all');
  };

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Assignment Mapel Kelas</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola penugasan mata pelajaran ke kelas</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Tambah Assignment
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Assignment</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{totalAssignments}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Assignment Aktif</p>
              <p className="mt-2 text-2xl font-semibold text-green-600">{activeAssignments}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Kelas dengan Mapel</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{uniqueClasses}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Mapel Terpakai</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{uniqueSubjects}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kelas atau mapel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Class */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Refresh data"
            >
              <RotateCcw size={18} />
            </button>

            {/* Clear Filters */}
            {(searchTerm || filterClass || filterSubject || filterStatus !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Mata Pelajaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Dibuat</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-600">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {classSubjects.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-8 text-center">
                    <p className="text-sm text-slate-500">Tidak ada data assignment</p>
                  </td>
                </tr>
              ) : (
                classSubjects.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{item.school_class?.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {item.subject?.code} - {item.subject?.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusPill status={item.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(item)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-600">
              Halaman {pagination.current_page} dari {pagination.last_page}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginationParams({ current_page: pagination.current_page - 1 })}
                disabled={pagination.current_page === 1}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPaginationParams({ current_page: pagination.current_page + 1 })}
                disabled={pagination.current_page === pagination.last_page}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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
