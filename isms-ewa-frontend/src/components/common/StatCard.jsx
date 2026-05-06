import clsx from 'clsx';

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'blue',
  className,
}) => {
  const colorClasses = {
    blue: {
      badge: 'bg-blue-100 text-blue-600',
      accent: 'text-blue-600',
      border: 'border-blue-200',
    },
    emerald: {
      badge: 'bg-emerald-100 text-emerald-600',
      accent: 'text-emerald-600',
      border: 'border-emerald-200',
    },
    amber: {
      badge: 'bg-amber-100 text-amber-600',
      accent: 'text-amber-600',
      border: 'border-amber-200',
    },
    rose: {
      badge: 'bg-rose-100 text-rose-600',
      accent: 'text-rose-600',
      border: 'border-rose-200',
    },
    indigo: {
      badge: 'bg-indigo-100 text-indigo-600',
      accent: 'text-indigo-600',
      border: 'border-indigo-200',
    },
  };

  const trendClasses = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-slate-600',
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={clsx('stat-card border-l-4', colors.border, className)}>
      {/* Icon Badge */}
      {Icon && (
        <div className={clsx('icon-badge', colors.badge)}>
          <Icon size={24} />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{title}</h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mt-2">
        <p className={clsx('text-4xl font-bold', colors.accent)}>{value}</p>
        {trend && (
          <span className={clsx('text-xs font-semibold', trendClasses[trendDirection])}>
            {trendDirection === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 mt-2">{description}</p>
      )}
    </div>
  );
};
