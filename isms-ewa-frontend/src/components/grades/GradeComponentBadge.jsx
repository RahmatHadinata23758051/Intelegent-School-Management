import clsx from 'clsx';
import { FileText, ClipboardCheck, BookOpen, FileCheck, Award } from 'lucide-react';

/**
 * Premium grade component badge
 * Displays grade component (TUGAS, QUIZ, WEEKLY, UTS, UAS) with icon
 */
export const GradeComponentBadge = ({ code, name, size = 'md', showIcon = true }) => {
  const componentConfig = {
    TUGAS: {
      label: 'Tugas',
      color: 'blue',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-700',
      icon: FileText,
    },
    QUIZ: {
      label: 'Quiz',
      color: 'purple',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-700',
      icon: ClipboardCheck,
    },
    WEEKLY: {
      label: 'Weekly',
      color: 'indigo',
      bgClass: 'bg-indigo-50',
      textClass: 'text-indigo-700',
      icon: BookOpen,
    },
    UTS: {
      label: 'UTS',
      color: 'amber',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      icon: FileCheck,
    },
    UAS: {
      label: 'UAS',
      color: 'emerald',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      icon: Award,
    },
  };

  const config = componentConfig[code] || {
    label: name || code,
    color: 'slate',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-700',
    icon: FileText,
  };

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
