import clsx from 'clsx';
import { Package } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Package,
  title = 'No data found',
  description = 'There is no data to display',
  action = null,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
