import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

/**
 * Premium attendance rate display card
 * Shows attendance percentage with visual indicator
 */
export const AttendanceRateCard = ({ rate, label = 'Tingkat Kehadiran', showTrend = false, trend = 0 }) => {
  const rateValue = parseFloat(rate) || 0;
  
  // Determine color based on rate
  const getColorClass = (rate) => {
    if (rate >= 90) return 'emerald';
    if (rate >= 75) return 'amber';
    return 'rose';
  };

  const color = getColorClass(rateValue);
  
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-600',
      lightBg: 'bg-emerald-50',
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      lightBg: 'bg-amber-50',
    },
    rose: {
      bg: 'bg-rose-500',
      text: 'text-rose-600',
      lightBg: 'bg-rose-50',
    },
  };

  const getTrendIcon = () => {
    if (trend > 0) return TrendingUp;
    if (trend < 0) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {showTrend && trend !== 0 && (
          <div
            className={clsx(
              'flex items-center gap-1 text-xs font-medium',
              trend > 0 ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            <TrendIcon size={14} strokeWidth={2} />
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 mb-3">
        <div
          className={clsx('h-full transition-all duration-500', colorClasses[color].bg)}
          style={{ width: `${Math.min(rateValue, 100)}%` }}
        />
      </div>

      {/* Rate value */}
      <div className="flex items-baseline gap-2">
        <span className={clsx('text-3xl font-bold', colorClasses[color].text)}>
          {rateValue.toFixed(1)}%
        </span>
        <span className="text-sm text-slate-500">kehadiran</span>
      </div>
    </div>
  );
};
