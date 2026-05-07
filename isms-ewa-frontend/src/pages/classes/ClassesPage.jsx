import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Users, User, Edit2, Trash2 } from 'lucide-react';
import { useClasses } from '../../hooks/useClasses';
import { useAuth } from '../../hooks/useAuth';
import { classService } from '../../services/classService';
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
import { ClassForm } from '../../components/classes/ClassForm';
import { getClassDetailRoute } from '../../constants/routes';

export const ClassesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClass, setDeletingClass] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: classesData, loading, error, params, updateParams, goToPage, refetch } = useClasses();

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value });
  };

  const handleClearSearch = () => {
    setSearch('');
    updateParams({ search: '' });
  };

  /**
   * Handle add class
   */
  const handleAddClass = () => {
    setEditingClass(null);
    setFormError(null);
    setShowModal(true);
  };

  /**
   * Handle edit class
   */
  const handleEditClass = (cls) => {
    setEditingClass(cls);
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

      if (editingClass) {
        // Update
        await classService.updateClass(editingClass.id, formData);
        setSuccessMessage('Kelas berhasil diperbarui');
      } else {
        // Create
        await classService.createClass(formData);
        setSuccessMessage('Kelas berhasil ditambahkan');
      }

      // Close modal and refresh list
      setShowModal(false);
      setEditingClass(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menyimpan kelas';
      setFormError(errorMsg);
      console.error('Form error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle delete class
   */
  const handleDeleteClass = (cls) => {
    setDeletingClass(cls);
    setShowDeleteConfirm(true);
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await classService.deleteClass(deletingClass.id);
      setSuccessMessage('Kelas berhasil dihapus');
      setShowDeleteConfirm(false);
      setDeletingClass(null);
      await refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat menghapus kelas';
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
    setEditingClass(null);
    setFormError(null);
  };

  const canCreateClass = user?.role === 'admin';

  if (loading) {
    return <LoadingScreen message="Loading classes..." />;
  }

  return (
    <AppLayout currentPage="classes">
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
          <h2 className="text-3xl font-bold text-slate-900">Classes</h2>
          <p className="text-slate-500 mt-1">Manage school classes and homeroom teachers</p>
        </div>
        {canCreateClass && (
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleAddClass}
          >
            <Plus size={20} />
            Add Class
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
            placeholder="Search by class name or grade level..."
          />
        </Card.Body>
      </Card>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Failed to load classes"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Classes Grid */}
      {!error && (
        <>
          {classesData?.data && classesData.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {classesData.data.map((cls) => (
                  <Card
                    key={cls.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                    onClick={() => navigate(getClassDetailRoute(cls.id))}
                  >
                    <Card.Body>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                          <BookOpen size={28} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {cls.grade_level || 'Grade'}
                        </span>
                      </div>

                      {/* Class Name */}
                      <h3 className="text-lg font-bold text-slate-900 mb-4">{cls.name}</h3>

                      {/* Details */}
                      <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Homeroom Teacher</p>
                            <p className="text-sm font-semibold text-slate-900">{cls.homeroom_teacher?.name || 'Not assigned'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users size={16} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Total Students</p>
                            <p className="text-sm font-semibold text-slate-900">{cls.students_count || 0} students</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(getClassDetailRoute(cls.id));
                          }}
                        >
                          View Details
                        </Button>
                        {canCreateClass && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClass(cls);
                              }}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                              title="Edit class"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls);
                              }}
                              className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
                              title="Delete class"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {classesData?.meta && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={classesData.meta.current_page}
                    totalPages={classesData.meta.last_page}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No classes found"
              description="Try adjusting your search criteria"
            />
          )}
        </>
      )}

      {/* Class Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingClass ? 'Edit Class' : 'Add Class'}
        size="lg"
      >
        <ClassForm
          initialData={editingClass}
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
        title="Delete Class"
        message={`Are you sure you want to delete ${deletingClass?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </AppLayout>
  );
};
