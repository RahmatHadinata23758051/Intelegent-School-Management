import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Plus, Edit2, Trash2, AlertCircle, BookOpen } from 'lucide-react';
import { useGrades } from '../../hooks/useGrades';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { GradeForm } from './GradeForm';
import { formatScore, formatDate, formatSemester, formatAcademicYear } from '../../utils/formatters';

/**
 * Grades Panel Component
 * Menampilkan list grades dan form untuk create/edit/delete
 */
export const GradesPanel = ({
  studentId,
  onMutationSuccess = null,
  canManage = true,
}) => {
  const { user } = useAuth();
  const {
    grades,
    loading,
    error,
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
  } = useGrades(studentId, onMutationSuccess);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [formError, setFormError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch grades on mount
  useEffect(() => {
    fetchGrades();
  }, [studentId]);

  /**
   * Handle create grade
   */
  const handleCreateGrade = async (formData) => {
    setFormError(null);
    const result = await createGrade(formData);

    if (result.success) {
      setIsFormModalOpen(false);
      setSelectedGrade(null);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handle update grade
   */
  const handleUpdateGrade = async (formData) => {
    setFormError(null);
    const result = await updateGrade(selectedGrade.id, formData);

    if (result.success) {
      setIsFormModalOpen(false);
      setSelectedGrade(null);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handle delete grade
   */
  const handleDeleteGrade = async () => {
    setDeleteLoading(true);
    const result = await deleteGrade(selectedGrade.id);

    if (result.success) {
      setIsDeleteConfirmOpen(false);
      setSelectedGrade(null);
    }
    setDeleteLoading(false);
  };

  /**
   * Open form modal untuk create
   */
  const openCreateForm = () => {
    setSelectedGrade(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  /**
   * Open form modal untuk edit
   */
  const openEditForm = (grade) => {
    setSelectedGrade(grade);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  /**
   * Open delete confirm
   */
  const openDeleteConfirm = (grade) => {
    setSelectedGrade(grade);
    setIsDeleteConfirmOpen(true);
  };

  // Check if user can manage grades
  const userCanManage = canManage && ['admin', 'teacher', 'homeroom_teacher'].includes(user?.role);

  return (
    <Card>
      {/* Header */}
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Nilai Akademik</h3>
              <p className="text-sm text-slate-500">Daftar nilai siswa</p>
            </div>
          </div>
          {userCanManage && (
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateForm}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Nilai
            </Button>
          )}
        </div>
      </Card.Header>

      {/* Body */}
      <Card.Body>
        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex gap-3 mb-4">
            <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-900">Gagal memuat nilai</p>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-600">Memuat nilai...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && grades.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Belum ada nilai</p>
            <p className="text-sm text-slate-500 mt-1">Tambahkan nilai akademik siswa</p>
          </div>
        )}

        {/* Grades List */}
        {!loading && grades.length > 0 && (
          <div className="space-y-3">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{grade.subject}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
                        <span>{formatSemester(grade.semester)}</span>
                        <span>{formatAcademicYear(grade.academic_year)}</span>
                        <span>{formatDate(grade.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right mr-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatScore(grade.score)}
                  </p>
                  <p className="text-xs text-slate-500">/100</p>
                </div>

                {/* Actions */}
                {userCanManage && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(grade)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(grade)}
                      className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card.Body>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedGrade(null);
          setFormError(null);
        }}
        title={selectedGrade ? 'Edit Nilai' : 'Tambah Nilai'}
        size="md"
      >
        <GradeForm
          initialData={selectedGrade}
          onSubmit={selectedGrade ? handleUpdateGrade : handleCreateGrade}
          loading={loading}
          error={formError}
        />
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedGrade(null);
        }}
        onConfirm={handleDeleteGrade}
        title="Hapus Nilai"
        message={`Apakah Anda yakin ingin menghapus nilai ${selectedGrade?.subject}?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
      />
    </Card>
  );
};
