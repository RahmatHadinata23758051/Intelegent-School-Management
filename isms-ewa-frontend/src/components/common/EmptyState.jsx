import clsx from 'clsx';
import { Package } from 'lucide-react';

/**
 * Premium Empty State Component
 * Awwwards-inspired design with subtle animations and better visual hierarchy
 */
export const EmptyState = ({
  icon: Icon = Package,
  title = 'No data found',
  description = 'There is no data to display',
  action = null,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4', className)}>
      {/* Icon with gradient background and subtle animation */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl blur-xl opacity-60 animate-pulse" />
        <div className="relative w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center border border-slate-200/50 shadow-sm">
          <Icon size={28} className="text-slate-400" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Content with better typography */}
      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 text-center max-w-md leading-relaxed">{description}</p>
      
      {/* Action button with spacing */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
