import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Filter as FilterIcon, RotateCcw, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGradeComponents } from '../../hooks/useGradeComponents';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Alert } from '../../components/common/Alert';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { GradeComponentForm } from '../../components/grades/GradeComponentForm';
import { GradeComponentBadge } from '../../components/grades/GradeComponentBadge';
import clsx from 'clsx';

/**
 * Grade Components Page
 * Manage grade components (TUGAS, QUIZ, WEEKLY, UTS, UAS)
 */
export const GradeComponentsPage = () => {
  const { user } = useAuth();
  
  const {
    data: components,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    refetch,
    create,
    update,
    delete: deleteComponent,
    initialize,
    hasInitialized,
  } = useGradeComponents();

  const [showForm, setShowForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  const isAdmin = user?.role === 'admin';

  // Calculate summary
  const summary = {
    total: pagination.total || 0,
    active: components.filter((c) => c.is_active).length,
    inactive: components.filter((c) => !c.is_active).length,
    total_weight: components
      .filter((c) => c.is_active && c.default_weight)
      .reduce((sum, c) => sum + parseFloat(c.default_weight || 0), 0)
      .toFixed(2),
  };

  // Initialize on mount
  useEffect(() => {
    if (!hasInitialized) {
      initialize();
    }
  }, [hasInitialized, initialize]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    updateParams(filters);
  }, [filters, updateParams]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
    });
    updateParams({
      search: '',
      status: 'all',
    });
  }, [updateParams]);

  const handleCreate = () => {
    setEditingComponent(null);
    setShowForm(true);
  };

  const handleEdit = (component) => {
    setEditingComponent(component);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingComponent) {
        await update(editingComponent.id, formData);
        setSuccessMessage('Komponen nilai berhasil diperbarui');
      } else {
        await create(formData);
        setSuccessMessage('Komponen nilai berhasil dibuat');
      }
      setShowForm(false);
      setEditingComponent(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setIsSubmitting(true);
    try {
      await deleteComponent(showDeleteConfirm.id);
      setSuccessMessage('Komponen nilai berhasil dihapus');
      setShowDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && components.length === 0) {
    return <LoadingScreen message="Memuat komponen nilai..." />;
  }

  return (
    <AppLayout currentPage="grade-components">
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
          <h1 className="text-3xl font-bold text-slate-900">Komponen Nilai</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola komponen penilaian seperti Tugas, Quiz, UTS, dan UAS
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Tambah Komponen
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-600 mb-1">Total Komponen</p>
          <p className="text-2xl font-bold text-slate-900">{summary.total}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-600 mb-1">Komponen Aktif</p>
          <p className="text-2xl font-bold text-slate-900">{summary.active}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-slate-500">
          <p className="text-sm font-medium text-slate-600 mb-1">Komponen Nonaktif</p>
          <p className="text-2xl font-bold text-slate-900">{summary.inactive}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-slate-600 mb-1">Total Bobot Default</p>
          <p className="text-2xl font-bold text-slate-900">{summary.total_weight}%</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode atau nama komponen..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <FilterIcon size={16} />
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
        <ErrorState title="Gagal memuat komponen nilai" message={error} onRetry={refetch} />
      )}

      {/* Components Table */}
      {!error && (
        <>
          {components.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Belum ada komponen nilai"
              description="Tambahkan komponen nilai pertama untuk mulai mengelola penilaian"
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Kode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Bobot Default
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Urutan
                      </th>
                      {isAdmin && (
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Aksi
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {components.map((component) => (
                      <tr key={component.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <GradeComponentBadge code={component.code} name={component.name} />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{component.name}</p>
                            {component.description && (
                              <p className="text-xs text-slate-500 mt-0.5">{component.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {component.default_weight ? `${component.default_weight}%` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          {component.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {component.sort_order}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(component)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                                title="Edit"
                              >
                                <Edit2 size={16} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(component)}
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

      {/* Form Modal */}
      {showForm && (
        <GradeComponentForm
          component={editingComponent}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingComponent(null);
          }}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Komponen Nilai"
        message={`Apakah Anda yakin ingin menghapus komponen nilai "${showDeleteConfirm?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={isSubmitting}
      />
    </AppLayout>
  );
};
