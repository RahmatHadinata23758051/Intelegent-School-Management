import clsx from 'clsx';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const Icon = icons[type];

  const variants = {
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    error: 'text-rose-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };

  return (
    <div
      className={clsx(
        'rounded-xl border-l-4 p-4 flex gap-4 shadow-sm animate-slide-in',
        variants[type],
        type === 'error' && 'border-l-rose-600',
        type === 'success' && 'border-l-emerald-600',
        type === 'warning' && 'border-l-amber-600',
        type === 'info' && 'border-l-blue-600',
        className
      )}
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[type])} />
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
