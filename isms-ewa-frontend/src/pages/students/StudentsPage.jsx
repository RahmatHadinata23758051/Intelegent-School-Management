import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, Edit2, Trash2, RotateCcw, TrendingUp, AlertCircle } from 'lucide-react';
import { useStudents } from '../../hooks/useStudents';
import { useClasses } from '../../hooks/useClasses';
import { useAuth } from '../../hooks/useAuth';
import { studentService } from '../../services/studentService';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SearchInput } from '../../components/common/SearchInput';
import { SelectFilter } from '../../components/common/SelectFilter';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { RiskBadge } from '../../components/common/RiskBadge';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StudentForm } from '../../components/students/StudentForm';
import { getStudentDetailRoute } from '../../constants/routes';

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

export const StudentsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  // Debounce search
  const debouncedSearch = useDebounce(search, 500);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: studentsData, loading: studentsLoading, error: studentsError, params, updateParams, goToPage, refetch, initialize, hasInitialized } = useStudents();
  const { data: classesData } = useClasses({ per_page: 100 });

  // Initialize data fetch when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasInitialized) {
      initialize();
    }
  }, [isAuthenticated, authLoading, hasInitialized, initialize]);

  // Optimized handlers with useCallback
  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleClassFilter = useCallback((value) => {
    setSelectedClass(value);
    updateParams({ school_class_id: value || undefined });
  }, [updateParams]);

  const handleRiskFilter = useCallback((value) => {
    setSelectedRisk(value);
    updateParams({ risk_level: value || undefined });
  }, [updateParams]);

  const handleClearSearch = useCallback(() => {
    setSearch('');
    updateParams({ search: '' });
  }, [updateParams]);

  // Update search params only when debounced value changes
  useEffect(() => {
    if (hasInitialized && debouncedSearch !== params.search) {
      updateParams({ search: debouncedSearch });
    }
  }, [debouncedSearch, params.search, updateParams, hasInitialized]);

  /**
   * Handle add student
   */
  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormError(null);
    setShowModal(true);
  };

  /**
   * Handle edit student
   */
  const handleEditStudent = (student) => {
    setEditingStudent(student);
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

      if (editingStudent) {
        // Update
        await studentService.updateStudent(editingStudent.id, formData);
        setSuccessMessage('Siswa berhasil diperbarui');
      } else {
        // Create
        await studentService.createStudent(formData);
        setSuccessMessage('Siswa berhasil ditambahkan');
      }

      // Close modal and refresh list
      setShowModal(false);
      setEditingStudent(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menyimpan siswa';
      setFormError(errorMsg);
      console.error('Form error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle delete student
   */
  const handleDeleteStudent = (student) => {
    setDeletingStudent(student);
    setShowDeleteConfirm(true);
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await studentService.deleteStudent(deletingStudent.id);
      setSuccessMessage('Siswa berhasil dihapus');
      setShowDeleteConfirm(false);
      setDeletingStudent(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menghapus siswa';
      setErrorMessage(errorMsg);
      console.error('Delete error:', err);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handle close modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormError(null);
  };

  const canCreateStudent = user?.role === 'admin';

  // Memoize expensive calculations
  const classOptions = useMemo(() => 
    classesData?.data?.map((cls) => ({
      value: cls.id,
      label: cls.name,
    })) || [], [classesData?.data]);

  const riskOptions = useMemo(() => [
    { value: 'safe', label: 'Safe' },
    { value: 'warning', label: 'Warning' },
    { value: 'high_risk', label: 'High Risk' },
  ], []);

  // Memoize summary statistics
  const summaryStats = useMemo(() => {
    const data = studentsData?.data || [];
    return {
      total: studentsData?.meta?.total || 0,
      safe: data.filter(s => s.risk_score?.risk_level === 'safe').length,
      warning: data.filter(s => s.risk_score?.risk_level === 'warning').length,
      highRisk: data.filter(s => s.risk_score?.risk_level === 'high_risk').length,
    };
  }, [studentsData?.data, studentsData?.meta?.total]);

  if (studentsLoading && !studentsData) {
    return <LoadingScreen message="Memuat data siswa..." />;
  }

  return (
    <AppLayout currentPage="students">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4">
          <Alert
            type="success"
            title="Berhasil"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4">
          <Alert
            type="error"
            title="Error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <p className="text-sm text-slate-600 mt-1">Kelola data siswa dan monitor tingkat risiko</p>
        </div>
        {canCreateStudent && (
          <button
            onClick={handleAddStudent}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Tambah Siswa
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Siswa</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{summaryStats.total}</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua siswa terdaftar</p>
            </div>
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Aman</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{summaryStats.safe}</p>
              <p className="text-xs text-slate-500 mt-0.5">Risiko rendah</p>
            </div>
            <div className="p-2.5 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Perhatian</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{summaryStats.warning}</p>
              <p className="text-xs text-slate-500 mt-0.5">Risiko sedang</p>
            </div>
            <div className="p-2.5 bg-yellow-100 rounded-lg">
              <AlertCircle size={20} className="text-yellow-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Risiko Tinggi</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{summaryStats.highRisk}</p>
              <p className="text-xs text-slate-500 mt-0.5">Perlu perhatian khusus</p>
            </div>
            <div className="p-2.5 bg-red-100 rounded-lg">
              <AlertCircle size={20} className="text-red-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Cari nama, NIS, atau email..."
            />
          </div>
          <SelectFilter
            label="Kelas"
            value={selectedClass}
            onChange={handleClassFilter}
            options={classOptions}
            placeholder="Semua Kelas"
          />
          <SelectFilter
            label="Tingkat Risiko"
            value={selectedRisk}
            onChange={handleRiskFilter}
            options={riskOptions}
            placeholder="Semua Level"
          />
          <button
            onClick={refetch}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Refresh data"
          >
            <RotateCcw size={18} strokeWidth={1.5} />
          </button>
        </div>
      </Card>

      {/* Error State */}
      {studentsError && (
        <ErrorState
          title="Failed to load students"
          message={studentsError}
          onRetry={refetch}
        />
      )}

      {/* Students Table */}
      {!studentsError && (
        <>
          {studentsData?.data && studentsData.data.length > 0 ? (
            <Card className="mb-6 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">NIS</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tingkat Risiko</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {studentsData.data.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.student_id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.school_class?.name || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <RiskBadge level={student.risk_score?.risk_level || 'safe'} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(getStudentDetailRoute(student.id))}
                            >
                              Lihat
                            </Button>
                            {canCreateStudent && (
                              <>
                                <button
                                  onClick={() => handleEditStudent(student)}
                                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                  title="Edit siswa"
                                >
                                  <Edit2 size={16} strokeWidth={1.5} />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                  title="Hapus siswa"
                                >
                                  <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={Users}
              title="Tidak ada siswa ditemukan"
              description="Coba sesuaikan pencarian atau filter Anda"
            />
          )}

          {/* Pagination */}
          {studentsData?.meta && studentsData.meta.last_page > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={studentsData.meta.current_page}
                totalPages={studentsData.meta.last_page}
                onPageChange={goToPage}
              />
            </div>
          )}
        </>
      )}

      {/* Student Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Siswa' : 'Tambah Siswa'}
        size="lg"
      >
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleSubmitForm}
          loading={formLoading}
          error={formError}
          classes={classesData?.data || []}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Siswa"
        message={`Apakah Anda yakin ingin menghapus ${deletingStudent?.name}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
      />
    </AppLayout>
  );
};
