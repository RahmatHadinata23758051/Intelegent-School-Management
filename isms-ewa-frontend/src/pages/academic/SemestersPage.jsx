import { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, CheckCircle2, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';
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
import { StatusPill } from '../../components/design-system';

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
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Semester</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola semester dalam tahun ajaran</p>
        </div>
        {canManage && (
          <button
            onClick={handleAddSemester}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Tambah Semester
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Cari semester..."
            />
          </div>
          <SelectFilter
            label="Tahun Ajaran"
            value={selectedAcademicYear}
            onChange={handleFilterByAcademicYear}
            options={academicYearsData?.data?.map(ay => ({ value: ay.id, label: ay.year })) || []}
            placeholder="Semua Tahun Ajaran"
          />
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Refresh data"
          >
            <RefreshCw size={18} strokeWidth={1.5} />
          </button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Semester Aktif</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">{semestersData?.data?.filter(s => s.is_active).length || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Sedang berjalan</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-100">
              <BookOpen size={20} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Semester</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{semestersData?.meta?.total || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua semester</p>
            </div>
            <div className="p-2.5 rounded-lg bg-green-100">
              <TrendingUp size={20} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Kelas Terkait</p>
              <p className="mt-2 text-2xl font-bold text-purple-600">{semestersData?.data?.reduce((sum, s) => sum + (s.classes_count || 0), 0) || '0'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total kelas</p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-100">
              <Users size={20} className="text-purple-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

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
              <Card className="mb-6 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tahun Ajaran</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Periode</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Diperbarui</th>
                      {canManage && <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {semestersData.data.map((sem) => (
                      <tr key={sem.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          Semester {sem.semester_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sem.academic_year?.year}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(sem.start_date).toLocaleDateString('id-ID')} – {new Date(sem.end_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <StatusPill status={sem.is_active ? 'Berjalan' : 'Selesai'} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sem.classes_count || 0}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(sem.updated_at).toLocaleDateString('id-ID')}
                        </td>
                        {canManage && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {!sem.is_active && (
                                <button
                                  onClick={() => handleActivateSemester(sem)}
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                                  title="Aktifkan"
                                >
                                  <CheckCircle2 size={16} strokeWidth={1.5} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditSemester(sem)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                title="Edit"
                              >
                                <Edit2 size={16} strokeWidth={1.5} />
                              </button>
                              {!sem.is_active && (
                                <button
                                  onClick={() => handleDeleteSemester(sem)}
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
              {semestersData?.meta && semestersData.meta.last_page > 1 && (
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
