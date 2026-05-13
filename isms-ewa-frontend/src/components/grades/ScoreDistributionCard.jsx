import clsx from 'clsx';

/**
 * Score distribution card component
 * Displays score distribution with progress bars
 */
export const ScoreDistributionCard = ({ distribution = {}, total = 0 }) => {
  const ranges = [
    { key: '90-100', label: '90-100 (Sangat Baik)', color: 'emerald' },
    { key: '80-89', label: '80-89 (Baik)', color: 'blue' },
    { key: '70-79', label: '70-79 (Cukup)', color: 'amber' },
    { key: '60-69', label: '60-69 (Rendah)', color: 'orange' },
    { key: '0-59', label: '0-59 (Sangat Rendah)', color: 'rose' },
  ];

  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500',
    rose: 'bg-rose-500',
  };

  const getPercentage = (count) => {
    if (total === 0) return 0;
    return (count / total) * 100;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Distribusi Nilai
      </h3>
      
      <div className="space-y-4">
        {ranges.map((range) => {
          const count = distribution[range.key] || 0;
          const percentage = getPercentage(count);
          
          return (
            <div key={range.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">
                  {range.label}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-300',
                    colorClasses[range.color]
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Total Nilai
          </span>
          <span className="text-lg font-bold text-slate-900">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
};
