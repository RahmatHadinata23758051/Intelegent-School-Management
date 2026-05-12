import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, Edit2, Trash2, RotateCcw } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Students</h2>
          <p className="text-slate-500 mt-1">Manage and monitor student information and risk levels</p>
        </div>
        {canCreateStudent && (
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleAddStudent}
          >
            <Plus size={20} />
            Add Student
          </Button>
        )}
      </div>

      {/* Filters Card */}
      <Card className="mb-8">
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search by name, ID, or email..."
            />
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
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={refetch}
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                title="Refresh data"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </Card.Body>
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
