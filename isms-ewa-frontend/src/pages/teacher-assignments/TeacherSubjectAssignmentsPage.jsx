import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Plus,
  Search,
  Filter,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTeacherSubjectAssignments } from '../../hooks/useTeacherSubjectAssignments';
import { AppLayout } from '../../components/layout/AppLayout';
import { TeacherSubjectAssignmentForm } from '../../components/teacher-assignments/TeacherSubjectAssignmentForm';
import { TeacherSubjectAssignmentTable } from '../../components/teacher-assignments/TeacherSubjectAssignmentTable';
import { Card } from '../../components/common/Card';
import { ROUTES } from '../../constants/routes';

/**
 * Teacher Subject Assignments Management Page
 */
export const TeacherSubjectAssignmentsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data,
    loading,
    error,
    pagination,
    filters,
    search,
    filterByTeacher,
    filterByAcademicYear,
    filterByStatus,
    sort,
    changePage,
    create,
    update,
    remove,
    refetch,
  } = useTeacherSubjectAssignments();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Check authorization
  const isAdmin = user?.role === 'admin';
  const canCreate = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);

    try {
      let result;
      if (editingAssignment) {
        result = await update(editingAssignment.id, formData);
      } else {
        result = await create(formData);
      }

      if (result.success) {
        setSuccessMessage(
          editingAssignment
            ? 'Assignment berhasil diperbarui'
            : 'Assignment berhasil dibuat'
        );
        setShowForm(false);
        setEditingAssignment(null);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setFormError(result.error);
      }
    } catch (err) {
      setFormError(err.message || 'Terjadi kesalahan');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus assignment ini?')) {
      return;
    }

    try {
      const result = await remove(id);
      if (result.success) {
        setSuccessMessage('Assignment berhasil dihapus');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setFormError(err.message || 'Gagal menghapus assignment');
    }
  };

  // Handle edit
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
    setFormError(null);
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    search(value);
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAssignment(null);
    setFormError(null);
  };

  if (authLoading) {
    return <AppLayout currentPage="teacher-assignments">Loading...</AppLayout>;
  }

  return (
    <AppLayout currentPage="teacher-assignments">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Assignment Guru Mapel</h1>
        <p className="mt-2 text-slate-600">
          Tentukan guru yang mengajar mata pelajaran pada kelas tertentu
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-900">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingAssignment ? 'Edit Assignment' : 'Tambah Assignment'}
              </h2>
              <button
                onClick={handleCancelForm}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <TeacherSubjectAssignmentForm
                initialData={editingAssignment}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                loading={formLoading}
                error={formError}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Total Assignment</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{pagination.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Assignment Aktif</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {data.filter((a) => a.is_active).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Total Guru Mengajar</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {new Set(data.map((a) => a.teacher_profile_id)).size}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Total Kelas Terisi Guru</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {new Set(data.map((a) => a.class_subject_id)).size}
          </p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari guru, mapel, atau kelas..."
              value={searchInput}
              onChange={handleSearch}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Add Button */}
        {canCreate && (
          <button
            onClick={() => {
              setEditingAssignment(null);
              setShowForm(true);
              setFormError(null);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Assign Guru
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6 p-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filters.filterStatus ?? ''}
                onChange={(e) =>
                  filterByStatus(e.target.value === '' ? null : e.target.value === 'true')
                }
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Semua Status</option>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <TeacherSubjectAssignmentTable
          data={data}
          loading={loading}
          onEdit={canEdit ? handleEdit : null}
          onDelete={canDelete ? handleDelete : null}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </Card>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={clsx(
                'h-10 w-10 rounded-lg font-medium transition',
                page === pagination.current_page
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default TeacherSubjectAssignmentsPage;
