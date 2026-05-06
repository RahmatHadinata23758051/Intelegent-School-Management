import clsx from 'clsx';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export const RiskBadge = ({ level = 'safe', className }) => {
  const config = {
    safe: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      icon: CheckCircle,
      label: 'Safe',
      dot: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      icon: AlertCircle,
      label: 'Warning',
      dot: 'bg-amber-500',
    },
    high_risk: {
      bg: 'bg-rose-100',
      text: 'text-rose-700',
      icon: AlertTriangle,
      label: 'High Risk',
      dot: 'bg-rose-500',
    },
  };

  const style = config[level] || config.safe;
  const Icon = style.icon;

  return (
    <div className={clsx('badge-base', style.bg, style.text, className)}>
      <div className={clsx('w-2 h-2 rounded-full mr-2', style.dot)} />
      <Icon size={14} className="mr-1" />
      {style.label}
    </div>
  );
};
