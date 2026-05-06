import clsx from 'clsx';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export const RiskBadge = ({ level = 'safe', className }) => {
  const config = {
    safe: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      icon: CheckCircle,
      label: 'Safe',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      icon: AlertCircle,
      label: 'Warning',
    },
    high_risk: {
      bg: 'bg-rose-100',
      text: 'text-rose-700',
      icon: AlertTriangle,
      label: 'High Risk',
    },
  };

  const style = config[level] || config.safe;
  const Icon = style.icon;

  return (
    <div className={clsx('badge-base', style.bg, style.text, className)}>
      <Icon size={14} className="mr-1" />
      {style.label}
    </div>
  );
};
