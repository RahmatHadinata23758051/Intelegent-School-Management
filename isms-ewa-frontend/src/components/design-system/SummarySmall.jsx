import clsx from 'clsx';

/**
 * SummarySmall - Compact summary card for grid layouts
 * Horizontal layout with icon, label, value, and meta
 * 
 * Design: 24px padding, 56px icon container, rounded-full for circular icon
 */
export const SummarySmall = ({ 
  icon: Icon, 
  label, 
  value, 
  meta, 
  tone = 'blue' 
}) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-6">
      <div className="flex items-center gap-5">
        {/* Icon - Circular, 56px */}
        <div className={clsx(
          'grid h-14 w-14 place-items-center rounded-full',
          colors[tone]
        )}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div>
          <div className="text-[14px] font-medium text-slate-800">
            {label}
          </div>
          <div className="mt-1 text-[24px] font-medium leading-7 tracking-[-0.02em] text-slate-950">
            {value}
          </div>
          <div className="mt-1 text-[13px] leading-5 text-slate-500">
            {meta}
          </div>
        </div>
      </div>
    </div>
  );
};
