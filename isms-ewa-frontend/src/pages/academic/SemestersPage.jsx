import { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, CheckCircle2, Calendar, Users, TrendingUp, MoreVertical, RefreshCw } from 'lucide-react';
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
import { SummarySmall, StatusPill, SelectControl, DesignSearchInput } from '../../components/design-system';

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

      {/* Header with Action Button */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold leading-8 tracking-[-0.02em] text-slate-950">
            Semester
          </h2>
          <p className="mt-1 text-[14px] font-normal leading-6 text-slate-500">
            Kelola semester dalam tahun ajaran.
          </p>
        </div>
        {canManage && (
          <button
            onClick={handleAddSemester}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[14px] font-semibold text-white transition hover:bg-blue-700 hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2.5} />
            Tambah Semester
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6 grid grid-cols-12 gap-4 p-4 items-end">
        <div className="col-span-3">
          <DesignSearchInput
            placeholder="Cari semester..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <SelectControl label="Filter Tahun Ajaran" value="Semua Tahun Ajaran" />
        </div>
        <div className="col-span-3">
          <SelectControl label="Filter Status" value="Semua Status" />
        </div>
        <div className="col-span-3 flex justify-end">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium text-sm hover:shadow-sm"
            title="Refresh data"
          >
            <RefreshCw size={16} strokeWidth={2} />
            <span>Refresh</span>
          </button>
        </div>
      </Card>

      {/* Summary Cards - 3 column grid */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <SummarySmall 
          icon={BookOpen} 
          label="Semester Aktif" 
          value={semestersData?.data?.filter(s => s.is_active).length || '0'} 
          meta={semestersData?.data?.find(s => s.is_active)?.academic_year?.year || 'N/A'} 
          tone="blue" 
        />
        <SummarySmall 
          icon={TrendingUp} 
          label="Semester Berjalan" 
          value={semestersData?.data?.filter(s => s.is_active).length || '0'} 
          meta={semestersData?.data?.find(s => s.is_active) ? `Ganjil ${semestersData.data.find(s => s.is_active).academic_year?.year}` : 'N/A'} 
          tone="green" 
        />
        <SummarySmall 
          icon={Users} 
          label="Total Kelas Terkait" 
          value={semestersData?.data?.reduce((sum, s) => sum + (s.classes_count || 0), 0) || '0'} 
          meta="Di semua semester" 
          tone="purple" 
        />
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
              <Card className="mb-8 overflow-hidden">
                <div className="border-b border-slate-200 p-5">
                  <h2 className="text-[16px] font-medium leading-6 text-slate-950">
                    Daftar Semester
                  </h2>
                </div>
                <table className="w-full border-collapse text-left">
                  <thead className="border-b border-slate-200 text-[13px] font-medium text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Semester</th>
                      <th className="px-5 py-4">Tahun Ajaran</th>
                      <th className="px-5 py-4">Periode</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Kelas Terkait</th>
                      <th className="px-5 py-4">Terakhir Diperbarui</th>
                      {canManage && <th className="px-5 py-4 text-right">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[14px] text-slate-700">
                    {semestersData.data.map((sem, index) => (
                      <tr key={sem.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`grid h-10 w-10 place-items-center rounded-full ${
                              index === 0 ? 'bg-emerald-50 text-emerald-600' : 
                              index === 2 ? 'bg-amber-50 text-amber-600' : 
                              'bg-blue-50 text-blue-600'
                            }`}>
                              <Calendar size={18} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-950">
                                Ganjil {sem.academic_year?.year}
                              </div>
                              <div className="text-[13px] text-slate-500">
                                Semester {sem.semester_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {sem.academic_year?.year}
                        </td>
                        <td className="whitespace-pre-line px-5 py-4 leading-6">
                          {new Date(sem.start_date).toLocaleDateString('id-ID')} – {new Date(sem.end_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={sem.is_active ? 'Berjalan' : 'Selesai'} />
                        </td>
                        <td className="px-5 py-4">
                          {sem.classes_count || 0}
                        </td>
                        <td className="whitespace-pre-line px-5 py-4 leading-6">
                          <div>Admin ISMS-EWA</div>
                          <div className="text-[13px] text-slate-500">
                            {new Date(sem.updated_at).toLocaleDateString('id-ID')}
                          </div>
                        </td>
                        {canManage && (
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!sem.is_active && (
                                <button
                                  onClick={() => handleActivateSemester(sem)}
                                  className="rounded-lg p-2 text-green-600 transition hover:bg-green-100"
                                  title="Aktifkan semester"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditSemester(sem)}
                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                                title="Edit semester"
                              >
                                <Edit2 size={16} />
                              </button>
                              {!sem.is_active && (
                                <button
                                  onClick={() => handleDeleteSemester(sem)}
                                  className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100"
                                  title="Hapus semester"
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
                    Menampilkan {semestersData.data.length} dari {semestersData?.meta?.total || 0} data
                  </div>
                  {semestersData?.meta && (
                    <Pagination
                      currentPage={semestersData.meta.current_page}
                      totalPages={semestersData.meta.last_page}
                      onPageChange={goToPage}
                    />
                  )}
                </div>
              </Card>
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
