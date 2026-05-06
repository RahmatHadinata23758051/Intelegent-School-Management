import clsx from 'clsx';

export const Badge = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'badge-base bg-slate-100 text-slate-700',
    primary: 'badge-base bg-blue-100 text-blue-700',
    success: 'badge-base bg-emerald-100 text-emerald-700',
    warning: 'badge-base bg-amber-100 text-amber-700',
    danger: 'badge-base bg-rose-100 text-rose-700',
    info: 'badge-base bg-cyan-100 text-cyan-700',
  };

  return (
    <span
      className={clsx(variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export const RiskBadge = ({ level }) => {
  const variants = {
    safe: 'badge-base bg-emerald-100 text-emerald-700',
    warning: 'badge-base bg-amber-100 text-amber-700',
    high_risk: 'badge-base bg-rose-100 text-rose-700',
  };

  const labels = {
    safe: 'Safe',
    warning: 'Warning',
    high_risk: 'High Risk',
  };

  return (
    <span className={variants[level]}>
      {labels[level]}
    </span>
  );
};
