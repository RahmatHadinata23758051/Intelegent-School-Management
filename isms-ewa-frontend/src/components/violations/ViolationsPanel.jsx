import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Plus, Edit2, Trash2, AlertCircle, AlertTriangle } from 'lucide-react';
import { useViolations } from '../../hooks/useViolations';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ViolationForm } from './ViolationForm';
import { formatDate, formatSeverity } from '../../utils/formatters';

/**
 * Violations Panel Component
 * Menampilkan list violations dan form untuk create/edit/delete
 */
export const ViolationsPanel = ({
  studentId,
  onMutationSuccess = null,
  canManage = true,
}) => {
  const { user } = useAuth();
  const {
    violations,
    loading,
    error,
    fetchViolations,
    createViolation,
    updateViolation,
    deleteViolation,
  } = useViolations(studentId, onMutationSuccess);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [formError, setFormError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch violations on mount
  useEffect(() => {
    fetchViolations();
  }, [studentId]);

  /**
   * Handle create violation
   */
  const handleCreateViolation = async (formData) => {
    setFormError(null);
    const result = await createViolation(formData);

    if (result.success) {
      setIsFormModalOpen(false);
      setSelectedViolation(null);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handle update violation
   */
  const handleUpdateViolation = async (formData) => {
    setFormError(null);
    const result = await updateViolation(selectedViolation.id, formData);

    if (result.success) {
      setIsFormModalOpen(false);
      setSelectedViolation(null);
    } else {
      setFormError(result.error);
    }
  };

  /**
   * Handle delete violation
   */
  const handleDeleteViolation = async () => {
    setDeleteLoading(true);
    const result = await deleteViolation(selectedViolation.id);

    if (result.success) {
      setIsDeleteConfirmOpen(false);
      setSelectedViolation(null);
    }
    setDeleteLoading(false);
  };

  /**
   * Open form modal untuk create
   */
  const openCreateForm = () => {
    setSelectedViolation(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  /**
   * Open form modal untuk edit
   */
  const openEditForm = (violation) => {
    setSelectedViolation(violation);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  /**
   * Open delete confirm
   */
  const openDeleteConfirm = (violation) => {
    setSelectedViolation(violation);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * Get severity color
   */
  const getSeverityColor = (severity) => {
    const colors = {
      minor: 'bg-blue-100 text-blue-700 border-blue-200',
      moderate: 'bg-amber-100 text-amber-700 border-amber-200',
      major: 'bg-orange-100 text-orange-700 border-orange-200',
      severe: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return colors[severity] || colors.minor;
  };

  /**
   * Get severity icon
   */
  const getSeverityIcon = (severity) => {
    if (severity === 'major' || severity === 'severe') {
      return <AlertTriangle size={16} />;
    }
    return <AlertCircle size={16} />;
  };

  // Check if user can manage violations
  const userCanManage = canManage && ['admin', 'teacher', 'homeroom_teacher'].includes(user?.role);

  return (
    <Card>
      {/* Header */}
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Pelanggaran</h3>
              <p className="text-sm text-slate-500">Daftar pelanggaran siswa</p>
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
              Tambah Pelanggaran
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
              <p className="text-sm font-medium text-rose-900">Gagal memuat pelanggaran</p>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-600">Memuat pelanggaran...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && violations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-emerald-600" />
            </div>
            <p className="text-slate-600 font-medium">Tidak ada pelanggaran</p>
            <p className="text-sm text-slate-500 mt-1">Siswa ini memiliki catatan perilaku yang baik</p>
          </div>
        )}

        {/* Violations List */}
        {!loading && violations.length > 0 && (
          <div className="space-y-3">
            {violations.map((violation) => (
              <div
                key={violation.id}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-colors',
                  violation.severity === 'major' || violation.severity === 'severe'
                    ? 'bg-rose-50 border-rose-200 hover:border-rose-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Description */}
                    <p className="font-semibold text-slate-900">{violation.description}</p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 mt-2">
                      {/* Severity Badge */}
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                          getSeverityColor(violation.severity)
                        )}
                      >
                        {getSeverityIcon(violation.severity)}
                        {formatSeverity(violation.severity)}
                      </span>

                      {/* Date */}
                      <span className="text-xs text-slate-600">
                        {formatDate(violation.reported_date)}
                      </span>

                      {/* Reporter */}
                      {violation.reporter && (
                        <span className="text-xs text-slate-600">
                          Dilaporkan oleh: {violation.reporter.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {userCanManage && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditForm(violation)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(violation)}
                        className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Warning untuk major/severe */}
                {(violation.severity === 'major' || violation.severity === 'severe') && (
                  <div className="mt-3 p-2 bg-rose-100 rounded border border-rose-200">
                    <p className="text-xs text-rose-700 font-medium">
                      ⚠️ Pelanggaran dengan tingkat keparahan tinggi mempengaruhi skor risiko siswa
                    </p>
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
          setSelectedViolation(null);
          setFormError(null);
        }}
        title={selectedViolation ? 'Edit Pelanggaran' : 'Tambah Pelanggaran'}
        size="md"
      >
        <ViolationForm
          initialData={selectedViolation}
          onSubmit={selectedViolation ? handleUpdateViolation : handleCreateViolation}
          loading={loading}
          error={formError}
        />
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedViolation(null);
        }}
        onConfirm={handleDeleteViolation}
        title="Hapus Pelanggaran"
        message={`Apakah Anda yakin ingin menghapus pelanggaran ini?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
      />
    </Card>
  );
};
