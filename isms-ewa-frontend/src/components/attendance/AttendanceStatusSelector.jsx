import { CheckCircle2, Clock, Stethoscope, FileText, XCircle } from 'lucide-react';
import clsx from 'clsx';

/**
 * Premium attendance status selector component
 * Segmented button design for quick status selection
 */
export const AttendanceStatusSelector = ({ value, onChange, disabled = false, size = 'md' }) => {
  const statuses = [
    {
      value: 'present',
      label: 'Hadir',
      icon: CheckCircle2,
      color: 'emerald',
      activeClass: 'bg-emerald-500 text-white border-emerald-600',
      hoverClass: 'hover:bg-emerald-50 hover:text-emerald-700',
    },
    {
      value: 'late',
      label: 'Terlambat',
      icon: Clock,
      color: 'amber',
      activeClass: 'bg-amber-500 text-white border-amber-600',
      hoverClass: 'hover:bg-amber-50 hover:text-amber-700',
    },
    {
      value: 'sick',
      label: 'Sakit',
      icon: Stethoscope,
      color: 'sky',
      activeClass: 'bg-sky-500 text-white border-sky-600',
      hoverClass: 'hover:bg-sky-50 hover:text-sky-700',
    },
    {
      value: 'permitted',
      label: 'Izin',
      icon: FileText,
      color: 'indigo',
      activeClass: 'bg-indigo-500 text-white border-indigo-600',
      hoverClass: 'hover:bg-indigo-50 hover:text-indigo-700',
    },
    {
      value: 'absent',
      label: 'Alpa',
      icon: XCircle,
      color: 'rose',
      activeClass: 'bg-rose-500 text-white border-rose-600',
      hoverClass: 'hover:bg-rose-50 hover:text-rose-700',
    },
  ];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 gap-1">
      {statuses.map((status) => {
        const Icon = status.icon;
        const isActive = value === status.value;

        return (
          <button
            key={status.value}
            type="button"
            onClick={() => !disabled && onChange(status.value)}
            disabled={disabled}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-md font-medium transition-all',
              sizeClasses[size],
              isActive
                ? status.activeClass
                : clsx(
                    'bg-white text-slate-600 border border-transparent',
                    !disabled && status.hoverClass
                  ),
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Icon size={iconSizes[size]} strokeWidth={2} />
            <span className="hidden sm:inline">{status.label}</span>
          </button>
        );
      })}
    </div>
  );
};
