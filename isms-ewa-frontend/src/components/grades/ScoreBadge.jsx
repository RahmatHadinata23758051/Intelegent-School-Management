import clsx from 'clsx';

/**
 * Premium score badge component
 * Displays score with color-coded design based on value
 * 
 * Score ranges:
 * - 90-100: Sangat Baik (emerald)
 * - 80-89: Baik (blue)
 * - 70-79: Cukup (amber)
 * - 60-69: Rendah (orange)
 * - 0-59: Sangat Rendah (rose)
 */
export const ScoreBadge = ({ score, size = 'md', showDot = true, showLabel = true }) => {
  const getScoreConfig = (score) => {
    const numScore = parseFloat(score);
    
    if (numScore >= 90) {
      return {
        label: 'Sangat Baik',
        color: 'emerald',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        dotClass: 'bg-emerald-500',
      };
    } else if (numScore >= 80) {
      return {
        label: 'Baik',
        color: 'blue',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-700',
        dotClass: 'bg-blue-500',
      };
    } else if (numScore >= 70) {
      return {
        label: 'Cukup',
        color: 'amber',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        dotClass: 'bg-amber-500',
      };
    } else if (numScore >= 60) {
      return {
        label: 'Rendah',
        color: 'orange',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-700',
        dotClass: 'bg-orange-500',
      };
    } else {
      return {
        label: 'Sangat Rendah',
        color: 'rose',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-700',
        dotClass: 'bg-rose-500',
      };
    }
  };

  const config = getScoreConfig(score);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
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
      {showDot && (
        <span className={clsx('rounded-full', config.dotClass, dotSizes[size])} />
      )}
      <span className="font-semibold">{parseFloat(score).toFixed(1)}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
