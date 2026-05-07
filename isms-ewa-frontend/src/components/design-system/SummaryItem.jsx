import clsx from 'clsx';

/**
 * SummaryItem - Summary statistic with icon and metadata
 * Used in card grids to display key metrics
 * 
 * Design: 24px padding, icon in colored background, left-aligned text
 */
export const SummaryItem = ({ 
  icon: Icon, 
  label, 
  value, 
  meta, 
  tone = 'blue' 
}) => {
  const toneClass = tone === 'green' 
    ? 'bg-emerald-50 text-emerald-600' 
    : tone === 'orange' 
    ? 'bg-orange-50 text-orange-600' 
    : 'bg-blue-50 text-blue-600';

  return (
    <div className="flex items-center gap-5 px-6 first:pl-0 last:pr-0">
      {/* Icon - 14px, 56px container */}
      <div className={clsx(
        'grid h-14 w-14 place-items-center rounded-xl',
        toneClass
      )}>
        <Icon size={24} />
      </div>

      {/* Content - Left-aligned, clear hierarchy */}
      <div>
        <div className="text-[14px] font-medium leading-5 text-slate-800">
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
  );
};
