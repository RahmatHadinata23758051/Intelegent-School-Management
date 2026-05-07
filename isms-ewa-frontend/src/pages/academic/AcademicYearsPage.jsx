import { useState } from 'react';
import { Plus, Calendar, Edit2, Trash2, CheckCircle2, AlertCircle, TrendingUp, Archive, MoreVertical } from 'lucide-react';
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
import { SummaryItem, StatusPill, SelectControl, DesignSearchInput } from '../../components/design-system';

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

      {/* Header with Action Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-semibold leading-8 tracking-[-0.02em] text-slate-950">
            Tahun Ajaran
          </h2>
          <p className="mt-1 text-[14px] font-normal leading-6 text-slate-500">
            Kelola tahun ajaran dan periode akademik.
          </p>
        </div>
        {canManage && (
          <button
            onClick={handleAddAcademicYear}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[14px] font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Tambah Tahun Ajaran
          </button>
        )}
      </div>

      {/* Summary Cards - 3 column grid */}
      <Card className="mb-6 grid grid-cols-3 divide-x divide-slate-200 p-6">
        <SummaryItem 
          icon={Calendar} 
          label="Total Tahun Ajaran" 
          value={academicYearsData?.meta?.total || '0'} 
          meta="Semua tahun ajaran terdaftar" 
          tone="blue" 
        />
        <SummaryItem 
          icon={TrendingUp} 
          label="Aktif" 
          value={academicYearsData?.data?.filter(ay => ay.is_active).length || '0'} 
          meta="Tahun ajaran sedang berjalan" 
          tone="green" 
        />
        <SummaryItem 
          icon={Archive} 
          label="Arsip" 
          value={academicYearsData?.data?.filter(ay => !ay.is_active).length || '0'} 
          meta="Tahun ajaran telah diarsipkan" 
          tone="orange" 
        />
      </Card>

      {/* Search and Filter Controls */}
      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <DesignSearchInput
            placeholder="Cari tahun ajaran..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="col-span-3 col-start-8">
          <SelectControl value="Semua Status" />
        </div>
        <div className="col-span-2">
          <SelectControl value="Urutkan: Terbaru" icon={TrendingUp} />
        </div>
      </div>

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
              <Card className="mb-8 overflow-hidden">
                <table className="w-full border-collapse text-left">
                  <thead className="border-b border-slate-200 text-[13px] font-medium text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Tahun Ajaran</th>
                      <th className="px-6 py-4">Periode</th>
                      <th className="px-6 py-4">Semester</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Dibuat Oleh</th>
                      {canManage && <th className="px-6 py-4 text-right">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[14px] text-slate-700">
                    {academicYearsData.data.map((ay) => (
                      <tr key={ay.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                              <Calendar size={18} />
                            </div>
                            <span className="text-[17px] font-medium tracking-[-0.01em] text-slate-950">
                              {ay.year}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(ay.start_date).toLocaleDateString('id-ID')} – {new Date(ay.end_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          {ay.semesters?.length || 0} semester
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={ay.is_active ? 'Aktif' : 'Arsip'} />
                        </td>
                        <td className="px-6 py-4">
                          <div>Admin ISMS-EWA</div>
                          <div className="text-[13px] text-slate-500">
                            {new Date(ay.created_at).toLocaleDateString('id-ID')}
                          </div>
                        </td>
                        {canManage && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!ay.is_active && (
                                <button
                                  onClick={() => handleActivateAcademicYear(ay)}
                                  className="rounded-lg p-2 text-green-600 transition hover:bg-green-100"
                                  title="Aktifkan tahun ajaran"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditAcademicYear(ay)}
                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                                title="Edit tahun ajaran"
                              >
                                <Edit2 size={16} />
                              </button>
                              {!ay.is_active && (
                                <button
                                  onClick={() => handleDeleteAcademicYear(ay)}
                                  className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100"
                                  title="Hapus tahun ajaran"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                              <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Table Footer with Pagination */}
                <div className="flex h-16 items-center justify-between border-t border-slate-200 px-6">
                  <div className="text-[13px] leading-5 text-slate-500">
                    Menampilkan {academicYearsData.data.length} dari {academicYearsData?.meta?.total || 0} data
                  </div>
                  {academicYearsData?.meta && (
                    <Pagination
                      currentPage={academicYearsData.meta.current_page}
                      totalPages={academicYearsData.meta.last_page}
                      onPageChange={goToPage}
                    />
                  )}
                </div>
              </Card>
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
