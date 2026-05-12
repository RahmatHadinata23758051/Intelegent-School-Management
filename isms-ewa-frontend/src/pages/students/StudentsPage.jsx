import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, Edit2, Trash2, RotateCcw, RefreshCw, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import clsx from 'clsx';
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

export const StudentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

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

  const { data: studentsData, loading: studentsLoading, error: studentsError, params, updateParams, goToPage, refetch } = useStudents();
  const { data: classesData, loading: classesLoading } = useClasses({ per_page: 100 });

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value });
  };

  const handleClassFilter = (value) => {
    setSelectedClass(value);
    updateParams({ school_class_id: value || undefined });
  };

  const handleRiskFilter = (value) => {
    setSelectedRisk(value);
    updateParams({ risk_level: value || undefined });
  };

  const handleClearSearch = () => {
    setSearch('');
    updateParams({ search: '' });
  };

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

  const classOptions = classesData?.data?.map((cls) => ({
    value: cls.id,
    label: cls.name,
  })) || [];

  const riskOptions = [
    { value: 'safe', label: 'Safe' },
    { value: 'warning', label: 'Warning' },
    { value: 'high_risk', label: 'High Risk' },
  ];

  if (studentsLoading) {
    return <LoadingScreen message="Loading students..." />;
  }

  return (
    <AppLayout currentPage="students">
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
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-600 mt-2">Manage and monitor student information and risk levels</p>
        </div>
        {canCreateStudent && (
          <button
            onClick={handleAddStudent}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Plus size={20} strokeWidth={2.5} />
            Add Student
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{studentsData?.meta?.total || 0}</p>
              <p className="text-xs text-slate-500 mt-1">All registered students</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Safe</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{studentsData?.data?.filter(s => s.risk_score?.risk_level === 'safe').length || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Low risk students</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp size={24} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Warning</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{studentsData?.data?.filter(s => s.risk_score?.risk_level === 'warning').length || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Medium risk students</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle size={24} className="text-yellow-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">High Risk</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{studentsData?.data?.filter(s => s.risk_score?.risk_level === 'high_risk').length || 0}</p>
              <p className="text-xs text-slate-500 mt-1">High risk students</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle size={24} className="text-red-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search by name, ID, or email..."
            />
          </div>
          <SelectFilter
            label="Class"
            value={selectedClass}
            onChange={handleClassFilter}
            options={classOptions}
            placeholder="All Classes"
          />
          <SelectFilter
            label="Risk Level"
            value={selectedRisk}
            onChange={handleRiskFilter}
            options={riskOptions}
            placeholder="All Levels"
          />
          <button
            onClick={refetch}
            className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Refresh data"
          >
            <RotateCcw size={20} strokeWidth={1.5} />
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
            <Card className="mb-8">
              <Card.Body className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="table-header">Name</th>
                        <th className="table-header">Student ID</th>
                        <th className="table-header">Class</th>
                        <th className="table-header">Risk Level</th>
                        <th className="table-header">Email</th>
                        <th className="table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.data.map((student) => (
                        <tr key={student.id} className="table-row">
                          <td className="table-cell font-semibold text-slate-900">{student.name}</td>
                          <td className="table-cell text-slate-600">{student.student_id}</td>
                          <td className="table-cell text-slate-600">{student.school_class?.name || '-'}</td>
                          <td className="table-cell">
                            <RiskBadge level={student.risk_score?.risk_level || 'safe'} />
                          </td>
                          <td className="table-cell text-slate-600">{student.email}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(getStudentDetailRoute(student.id))}
                              >
                                View
                              </Button>
                              {canCreateStudent && (
                                <>
                                  <button
                                    onClick={() => handleEditStudent(student)}
                                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                                    title="Edit student"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student)}
                                    className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
                                    title="Delete student"
                                  >
                                    <Trash2 size={16} />
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
              </Card.Body>
            </Card>
          ) : (
            <EmptyState
              icon={Users}
              title="No students found"
              description="Try adjusting your search or filter criteria"
            />
          )}

          {/* Pagination */}
          {studentsData?.meta && (
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
        title={editingStudent ? 'Edit Student' : 'Add Student'}
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
        title="Delete Student"
        message={`Are you sure you want to delete ${deletingStudent?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </AppLayout>
  );
};
