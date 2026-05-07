import { useState } from 'react';
import { Plus, Calendar, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tahun Ajaran</h2>
          <p className="text-slate-500 mt-1">Kelola tahun ajaran dan periode akademik</p>
        </div>
        {canManage && (
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleAddAcademicYear}
          >
            <Plus size={20} />
            Tambah Tahun Ajaran
          </Button>
        )}
      </div>

      {/* Search Card */}
      <Card className="mb-8">
        <Card.Body>
          <SearchInput
            value={search}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder="Cari tahun ajaran..."
          />
        </Card.Body>
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
              <Card className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tahun Ajaran</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tanggal Mulai</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tanggal Akhir</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                        {canManage && <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {academicYearsData.data.map((ay) => (
                        <tr key={ay.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{ay.year}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600">{new Date(ay.start_date).toLocaleDateString('id-ID')}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600">{new Date(ay.end_date).toLocaleDateString('id-ID')}</p>
                          </td>
                          <td className="px-6 py-4">
                            {ay.is_active ? (
                              <Badge variant="success" className="flex items-center gap-1 w-fit">
                                <CheckCircle2 size={14} />
                                Aktif
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Tidak Aktif</Badge>
                            )}
                          </td>
                          {canManage && (
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {!ay.is_active && (
                                  <button
                                    onClick={() => handleActivateAcademicYear(ay)}
                                    className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                    title="Aktifkan tahun ajaran"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditAcademicYear(ay)}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                                  title="Edit tahun ajaran"
                                >
                                  <Edit2 size={16} />
                                </button>
                                {!ay.is_active && (
                                  <button
                                    onClick={() => handleDeleteAcademicYear(ay)}
                                    className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
                                    title="Hapus tahun ajaran"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {academicYearsData?.meta && (
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
