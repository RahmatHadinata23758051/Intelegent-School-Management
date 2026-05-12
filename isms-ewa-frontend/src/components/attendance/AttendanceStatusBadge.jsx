import { CheckCircle2, Clock, Stethoscope, FileText, XCircle } from 'lucide-react';
import clsx from 'clsx';

/**
 * Premium attendance status badge component
 * Displays attendance status with color-coded design
 */
export const AttendanceStatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const statusConfig = {
    present: {
      label: 'Hadir',
      color: 'emerald',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      dotClass: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    late: {
      label: 'Terlambat',
      color: 'amber',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      dotClass: 'bg-amber-500',
      icon: Clock,
    },
    sick: {
      label: 'Sakit',
      color: 'sky',
      bgClass: 'bg-sky-50',
      textClass: 'text-sky-700',
      dotClass: 'bg-sky-500',
      icon: Stethoscope,
    },
    permitted: {
      label: 'Izin',
      color: 'indigo',
      bgClass: 'bg-indigo-50',
      textClass: 'text-indigo-700',
      dotClass: 'bg-indigo-500',
      icon: FileText,
    },
    absent: {
      label: 'Alpa',
      color: 'rose',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      dotClass: 'bg-rose-500',
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.absent;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgClass,
        config.textClass,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} strokeWidth={2} />}
      {config.label}
    </span>
  );
};
