import clsx from 'clsx';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

/**
 * Confirm Dialog Component
 * Untuk konfirmasi aksi yang penting (delete, dll)
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'default', // 'default' atau 'danger'
  loading = false,
}) => {
  const isDanger = variant === 'danger';

  const icon = isDanger ? (
    <AlertTriangle size={40} className="text-rose-600" />
  ) : (
    <AlertCircle size={40} className="text-amber-600" />
  );

  const bgColor = isDanger ? 'bg-rose-100' : 'bg-amber-100';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnEscape={!loading}
      closeOnOverlay={!loading}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Icon */}
        <div className={clsx('w-16 h-16 rounded-full flex items-center justify-center', bgColor)}>
          {icon}
        </div>

        {/* Message */}
        <p className="text-center text-slate-600">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3 w-full mt-6">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
