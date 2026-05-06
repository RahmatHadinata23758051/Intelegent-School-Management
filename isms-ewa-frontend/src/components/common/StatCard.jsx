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
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  const trendClasses = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-slate-600',
  };

  return (
    <div className={clsx('stat-card', className)}>
      {/* Icon Badge */}
      {Icon && (
        <div className={clsx('icon-badge', colorClasses[color])}>
          <Icon size={24} />
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm font-medium text-slate-600">{title}</h3>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {trend && (
          <span className={clsx('text-sm font-medium', trendClasses[trendDirection])}>
            {trendDirection === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
};
