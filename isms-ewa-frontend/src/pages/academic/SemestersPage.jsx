import { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useSemesters } from '../../hooks/useSemesters';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import { useAuth } from '../../hooks/useAuth';
import { semesterService } from '../../services/semesterService';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SearchInput } from '../../components/common/SearchInput';
import { SelectFilter } from '../../components/common/SelectFilter';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { SemesterForm } from '../../components/academic/SemesterForm';

export const SemestersPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingSemester, setDeletingSemester] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Activate confirmation state
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [activatingSemester, setActivatingSemester] = useState(null);
  const [activateLoading, setActivateLoading] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: semestersData, loading, error, params, updateParams, goToPage, refetch } = useSemesters();
  const { data: academicYearsData, loading: ayLoading } = useAcademicYears({ per_page: 100 });

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value });
  };

  const handleClearSearch = () => {
    setSearch('');
    updateParams({ search: '' });
  };

  const handleFilterByAcademicYear = (value) => {
    setSelectedAcademicYear(value);
    if (value) {
      updateParams({ academic_year_id: parseInt(value) });
    } else {
      updateParams({ academic_year_id: null });
    }
  };

  /**
   * Handle add semester
   */
  const handleAddSemester = () => {
    setEditingSemester(null);
    setFormError(null);
    setShowModal(true);
  };

  /**
   * Handle edit semester
   */
  const handleEditSemester = (sem) => {
    setEditingSemester(sem);
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

      if (editingSemester) {
        // Update
        await semesterService.updateSemester(editingSemester.id, formData);
        setSuccessMessage('Semester berhasil diperbarui');
      } else {
        // Create
        await semesterService.createSemester(formData);
        setSuccessMessage('Semester berhasil ditambahkan');
      }

      // Close modal and refresh list
      setShowModal(false);
      setEditingSemester(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menyimpan semester';
      setFormError(errorMsg);
      console.error('Form error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle delete semester
   */
  const handleDeleteSemester = (sem) => {
    setDeletingSemester(sem);
    setShowDeleteConfirm(true);
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await semesterService.deleteSemester(deletingSemester.id);
      setSuccessMessage('Semester berhasil dihapus');
      setShowDeleteConfirm(false);
      setDeletingSemester(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menghapus semester';
      setErrorMessage(errorMsg);
      console.error('Delete error:', err);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handle activate semester
   */
  const handleActivateSemester = (sem) => {
    setActivatingSemester(sem);
    setShowActivateConfirm(true);
  };

  /**
   * Handle confirm activate
   */
  const handleConfirmActivate = async () => {
    try {
      setActivateLoading(true);
      await semesterService.activateSemester(activatingSemester.id);
      setSuccessMessage('Semester berhasil diaktifkan');
      setShowActivateConfirm(false);
      setActivatingSemester(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat mengaktifkan semester';
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
    setEditingSemester(null);
    setFormError(null);
  };

  const canManage = user?.role === 'admin';

  if (loading || ayLoading) {
    return <LoadingScreen message="Loading semesters..." />;
  }

  return (
    <AppLayout currentPage="semesters">
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
          <h2 className="text-3xl font-bold text-slate-900">Semester</h2>
          <p className="text-slate-500 mt-1">Kelola semester dalam tahun ajaran</p>
        </div>
        {canManage && (
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleAddSemester}
          >
            <Plus size={20} />
            Tambah Semester
          </Button>
        )}
      </div>

      {/* Search and Filter Card */}
      <Card className="mb-8">
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Cari semester..."
            />
            <SelectFilter
              label="Filter Tahun Ajaran"
              value={selectedAcademicYear}
              onChange={handleFilterByAcademicYear}
              options={
                academicYearsData?.data?.map((ay) => ({
                  value: ay.id.toString(),
                  label: ay.year,
                })) || []
              }
              placeholder="Semua Tahun Ajaran"
            />
          </div>
        </Card.Body>
      </Card>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Gagal memuat semester"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Semesters Table */}
      {!error && (
        <>
          {semestersData?.data && semestersData.data.length > 0 ? (
            <>
              <Card className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tahun Ajaran</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Semester</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tanggal Mulai</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tanggal Akhir</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                        {canManage && <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {semestersData.data.map((sem) => (
                        <tr key={sem.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{sem.academic_year?.year}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600">Semester {sem.semester_number}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600">{new Date(sem.start_date).toLocaleDateString('id-ID')}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600">{new Date(sem.end_date).toLocaleDateString('id-ID')}</p>
                          </td>
                          <td className="px-6 py-4">
                            {sem.is_active ? (
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
                                {!sem.is_active && (
                                  <button
                                    onClick={() => handleActivateSemester(sem)}
                                    className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                    title="Aktifkan semester"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditSemester(sem)}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                                  title="Edit semester"
                                >
                                  <Edit2 size={16} />
                                </button>
                                {!sem.is_active && (
                                  <button
                                    onClick={() => handleDeleteSemester(sem)}
                                    className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
                                    title="Hapus semester"
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
              {semestersData?.meta && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={semestersData.meta.current_page}
                    totalPages={semestersData.meta.last_page}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Tidak ada semester"
              description="Mulai dengan menambahkan semester baru"
            />
          )}
        </>
      )}

      {/* Semester Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingSemester ? 'Edit Semester' : 'Tambah Semester'}
        size="lg"
      >
        <SemesterForm
          initialData={editingSemester}
          academicYears={academicYearsData?.data || []}
          selectedAcademicYear={selectedAcademicYear ? parseInt(selectedAcademicYear) : null}
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
        title="Hapus Semester"
        message={`Apakah Anda yakin ingin menghapus Semester ${deletingSemester?.semester_number} dari tahun ajaran ${deletingSemester?.academic_year?.year}? Tindakan ini tidak dapat dibatalkan.`}
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
        title="Aktifkan Semester"
        message={`Apakah Anda yakin ingin mengaktifkan Semester ${activatingSemester?.semester_number} dari tahun ajaran ${activatingSemester?.academic_year?.year}? Tahun ajaran akan otomatis diaktifkan jika belum aktif.`}
        confirmLabel="Aktifkan"
        cancelLabel="Batal"
        variant="primary"
        loading={activateLoading}
      />
    </AppLayout>
  );
};
