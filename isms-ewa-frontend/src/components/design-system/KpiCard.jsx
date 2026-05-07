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
      'rounded-xl border border-slate-200 bg-[#FAFBFD] p-6',
      wide && 'col-span-2'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* Icon Container - 12px radius, colored background */}
          <div className={clsx(
            'mb-5 grid h-12 w-12 place-items-center rounded-xl',
            tones[tone]
          )}>
            <Icon size={22} strokeWidth={2.2} />
          </div>

          {/* Title & Meta */}
          <div className="text-[14px] font-medium leading-5 text-slate-800">
            {title}
          </div>
          <div className="text-[13px] leading-5 text-slate-500">
            {meta}
          </div>

          {/* Value - Large, bold, tight tracking */}
          <div className="mt-5 text-[28px] font-medium leading-8 tracking-[-0.03em] text-slate-950">
            {value}
          </div>

          {/* Change indicator */}
          <div className={clsx('mt-2 text-[13px] leading-5', changeColor)}>
            {change}
          </div>
        </div>

        {/* Sparkline - positioned to the right */}
        <div className="mt-16">
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
