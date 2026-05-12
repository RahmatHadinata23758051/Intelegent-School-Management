import clsx from 'clsx';

/**
 * KpiCard - Key Performance Indicator Card
 * Displays a metric with icon, title, value, and trend sparkline
 * 
 * Design principles:
 * - 24px padding (8pt grid)
 * - Icon in colored background (12px border-radius)
 * - Clear visual hierarchy with typography scale
 * - Subtle sparkline for trend visualization
 */
export const KpiCard = ({ 
  icon: Icon, 
  title, 
  meta, 
  value, 
  change, 
  tone = 'blue',
  wide = false 
}) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-violet-50 text-violet-600',
    green: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  const changeColor = tone === 'rose' ? 'text-rose-600' : 'text-emerald-600';

  return (
    <div className={clsx(
      'rounded-xl border border-slate-200 bg-[#FAFBFD] p-6 hover:shadow-md transition-shadow',
      wide && 'col-span-2'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Icon Container - 12px radius, colored background */}
          <div className={clsx(
            'mb-5 grid h-12 w-12 place-items-center rounded-xl shadow-sm',
            tones[tone]
          )}>
            <Icon size={24} strokeWidth={2} />
          </div>

          {/* Title & Meta */}
          <div className="text-[13px] font-medium leading-5 text-slate-600 uppercase tracking-wide">
            {title}
          </div>
          <div className="text-[12px] leading-4 text-slate-500 mt-0.5">
            {meta}
          </div>

          {/* Value - Large, bold, tight tracking with proper alignment */}
          <div className="mt-6 text-[32px] font-bold leading-8 tracking-[-0.03em] text-slate-950 tabular-nums">
            {value}
          </div>

          {/* Change indicator */}
          <div className={clsx('mt-3 text-[12px] leading-4 font-medium', changeColor)}>
            {change}
          </div>
        </div>

        {/* Sparkline - positioned to the right */}
        <div className="mt-2 flex-shrink-0">
          <Sparkline tone={tone} />
        </div>
      </div>
    </div>
  );
};

/**
 * Sparkline - Minimal SVG chart for trend visualization
 * Uses semantic colors to indicate direction
 */
function Sparkline({ tone = 'blue' }) {
  const stroke = tone === 'green' 
    ? '#059669' 
    : tone === 'rose' 
    ? '#E11D48' 
    : tone === 'purple' 
    ? '#5B3DF5' 
    : '#2563EB';

  return (
    <svg 
      viewBox="0 0 120 48" 
      className="h-12 w-28" 
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="4,34 18,38 31,24 43,28 55,14 67,22 79,10 91,20 104,18 116,16"
      />
    </svg>
  );
}
