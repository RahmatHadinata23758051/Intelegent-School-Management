import clsx from 'clsx';

export const IconBadge = ({
  icon: Icon,
  size = 'md',
  color = 'blue',
  variant = 'solid',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const solidColors = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  const gradientColors = {
    blue: 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600',
    emerald: 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600',
    amber: 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600',
    rose: 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600',
    indigo: 'bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600',
    cyan: 'bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-600',
  };

  const outlineColors = {
    blue: 'border-2 border-blue-200 text-blue-600 bg-blue-50/50',
    emerald: 'border-2 border-emerald-200 text-emerald-600 bg-emerald-50/50',
    amber: 'border-2 border-amber-200 text-amber-600 bg-amber-50/50',
    rose: 'border-2 border-rose-200 text-rose-600 bg-rose-50/50',
    indigo: 'border-2 border-indigo-200 text-indigo-600 bg-indigo-50/50',
    cyan: 'border-2 border-cyan-200 text-cyan-600 bg-cyan-50/50',
  };

  const colorMap = {
    solid: solidColors,
    gradient: gradientColors,
    outline: outlineColors,
  };

  return (
    <div
      className={clsx(
        'icon-badge',
        sizeClasses[size],
        colorMap[variant][color],
        className
      )}
    >
      {Icon && <Icon size={iconSizes[size]} />}
    </div>
  );
};
