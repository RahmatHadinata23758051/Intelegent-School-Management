import { useState } from 'react';
import { Plus, Calendar, Edit2, Trash2, CheckCircle2, TrendingUp, Archive, RefreshCw } from 'lucide-react';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import { useAuth } from '../../hooks/useAuth';
import { academicYearService } from '../../services/academicYearService';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SearchInput } from '../../components/common/SearchInput';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { AcademicYearForm } from '../../components/academic/AcademicYearForm';
import { StatusPill } from '../../components/design-system';

export const AcademicYearsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAcademicYear, setEditingAcademicYear] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAcademicYear, setDeletingAcademicYear] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Activate confirmation state
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [activatingAcademicYear, setActivatingAcademicYear] = useState(null);
  const [activateLoading, setActivateLoading] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: academicYearsData, loading, error, params, updateParams, goToPage, refetch } = useAcademicYears();

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value });
  };

  const handleClearSearch = () => {
    setSearch('');
    updateParams({ search: '' });
  };

  /**
   * Handle add academic year
   */
  const handleAddAcademicYear = () => {
    setEditingAcademicYear(null);
    setFormError(null);
    setShowModal(true);
  };

  /**
   * Handle edit academic year
   */
  const handleEditAcademicYear = (ay) => {
    setEditingAcademicYear(ay);
    setFormError(null);
    setShowModal(true);
  };

  /**
   * Handle form submit (create or update)
   */
  const handleSubmitForm = async (formData) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (editingAcademicYear) {
        // Update
        await academicYearService.updateAcademicYear(editingAcademicYear.id, formData);
        setSuccessMessage('Tahun ajaran berhasil diperbarui');
      } else {
        // Create
        await academicYearService.createAcademicYear(formData);
        setSuccessMessage('Tahun ajaran berhasil ditambahkan');
      }

      // Close modal and refresh list
      setShowModal(false);
      setEditingAcademicYear(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menyimpan tahun ajaran';
      setFormError(errorMsg);
      console.error('Form error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle delete academic year
   */
  const handleDeleteAcademicYear = (ay) => {
    setDeletingAcademicYear(ay);
    setShowDeleteConfirm(true);
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await academicYearService.deleteAcademicYear(deletingAcademicYear.id);
      setSuccessMessage('Tahun ajaran berhasil dihapus');
      setShowDeleteConfirm(false);
      setDeletingAcademicYear(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menghapus tahun ajaran';
      setErrorMessage(errorMsg);
      console.error('Delete error:', err);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handle activate academic year
   */
  const handleActivateAcademicYear = (ay) => {
    setActivatingAcademicYear(ay);
    setShowActivateConfirm(true);
  };

  /**
   * Handle confirm activate
   */
  const handleConfirmActivate = async () => {
    try {
      setActivateLoading(true);
      await academicYearService.activateAcademicYear(activatingAcademicYear.id);
      setSuccessMessage('Tahun ajaran berhasil diaktifkan');
      setShowActivateConfirm(false);
      setActivatingAcademicYear(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat mengaktifkan tahun ajaran';
      setErrorMessage(errorMsg);
      console.error('Activate error:', err);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setActivateLoading(false);
    }
  };

  /**
   * Handle close modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAcademicYear(null);
    setFormError(null);
  };

  const canManage = user?.role === 'admin';

  if (loading) {
    return <LoadingScreen message="Loading academic years..." />;
  }

  return (
    <AppLayout currentPage="academic-years">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6">
          <Alert
            type="success"
            title="Sukses"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Kesalahan"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tahun Ajaran</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola tahun ajaran dan periode akademik</p>
        </div>
        {canManage && (
          <button
            onClick={handleAddAcademicYear}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Tambah Tahun Ajaran
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Tahun Ajaran</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{academicYearsData?.meta?.total || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua tahun ajaran</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-100">
              <Calendar size={20} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Aktif</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{academicYearsData?.data?.filter(ay => ay.is_active).length || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Sedang berjalan</p>
            </div>
            <div className="p-2.5 rounded-lg bg-green-100">
              <TrendingUp size={20} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Arsip</p>
              <p className="mt-2 text-2xl font-bold text-orange-600">{academicYearsData?.data?.filter(ay => !ay.is_active).length || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Telah diarsipkan</p>
            </div>
            <div className="p-2.5 rounded-lg bg-orange-100">
              <Archive size={20} className="text-orange-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Cari tahun ajaran..."
            />
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Refresh data"
          >
            <RefreshCw size={18} strokeWidth={1.5} />
          </button>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Gagal memuat tahun ajaran"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Academic Years Table */}
      {!error && (
        <>
          {academicYearsData?.data && academicYearsData.data.length > 0 ? (
            <>
              <Card className="mb-6 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tahun Ajaran</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Periode</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Dibuat</th>
                      {canManage && <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {academicYearsData.data.map((ay) => (
                      <tr key={ay.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{ay.year}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(ay.start_date).toLocaleDateString('id-ID')} – {new Date(ay.end_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{ay.semesters?.length || 0} semester</td>
                        <td className="px-6 py-4 text-sm">
                          <StatusPill status={ay.is_active ? 'Aktif' : 'Arsip'} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(ay.created_at).toLocaleDateString('id-ID')}
                        </td>
                        {canManage && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {!ay.is_active && (
                                <button
                                  onClick={() => handleActivateAcademicYear(ay)}
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                                  title="Aktifkan"
                                >
                                  <CheckCircle2 size={16} strokeWidth={1.5} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditAcademicYear(ay)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                title="Edit"
                              >
                                <Edit2 size={16} strokeWidth={1.5} />
                              </button>
                              {!ay.is_active && (
                                <button
                                  onClick={() => handleDeleteAcademicYear(ay)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                  title="Hapus"
                                >
                                  <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Pagination */}
              {academicYearsData?.meta && academicYearsData.meta.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={academicYearsData.meta.current_page}
                    totalPages={academicYearsData.meta.last_page}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Calendar}
              title="Tidak ada tahun ajaran"
              description="Mulai dengan menambahkan tahun ajaran baru"
            />
          )}
        </>
      )}

      {/* Academic Year Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAcademicYear ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
        size="lg"
      >
        <AcademicYearForm
          initialData={editingAcademicYear}
          onSubmit={handleSubmitForm}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Tahun Ajaran"
        message={`Apakah Anda yakin ingin menghapus tahun ajaran ${deletingAcademicYear?.year}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
      />

      {/* Activate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showActivateConfirm}
        onClose={() => setShowActivateConfirm(false)}
        onConfirm={handleConfirmActivate}
        title="Aktifkan Tahun Ajaran"
        message={`Apakah Anda yakin ingin mengaktifkan tahun ajaran ${activatingAcademicYear?.year}? Tahun ajaran yang sebelumnya aktif akan menjadi tidak aktif.`}
        confirmLabel="Aktifkan"
        cancelLabel="Batal"
        variant="primary"
        loading={activateLoading}
      />
    </AppLayout>
  );
};
