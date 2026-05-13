import { FileText, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import clsx from 'clsx';

/**
 * Weekly grade summary cards component
 * Displays key metrics for weekly grades
 */
export const WeeklyGradeSummaryCards = ({ 
  totalRecords = 0,
  averageScore = 0,
  lowScoreCount = 0,
  totalStudents = 0,
  loading = false,
}) => {
  const cards = [
    {
      title: 'Total Nilai',
      value: totalRecords,
      icon: FileText,
      color: 'blue',
      bgClass: 'bg-blue-50',
      iconClass: 'text-blue-600',
      borderClass: 'border-l-blue-500',
    },
    {
      title: 'Rata-rata Nilai',
      value: averageScore ? averageScore.toFixed(1) : '0.0',
      icon: TrendingUp,
      color: 'emerald',
      bgClass: 'bg-emerald-50',
      iconClass: 'text-emerald-600',
      borderClass: 'border-l-emerald-500',
    },
    {
      title: 'Nilai Rendah',
      value: lowScoreCount,
      subtitle: '< 70',
      icon: AlertTriangle,
      color: 'rose',
      bgClass: 'bg-rose-50',
      iconClass: 'text-rose-600',
      borderClass: 'border-l-rose-500',
    },
    {
      title: 'Siswa Dinilai',
      value: totalStudents,
      icon: Users,
      color: 'indigo',
      bgClass: 'bg-indigo-50',
      iconClass: 'text-indigo-600',
      borderClass: 'border-l-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.title}
            className={clsx(
              'bg-white rounded-2xl border border-slate-200 p-5',
              'border-l-4',
              card.borderClass
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {card.title}
                </p>
                {loading ? (
                  <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-900">
                      {card.value}
                    </p>
                    {card.subtitle && (
                      <span className="text-sm text-slate-500">
                        {card.subtitle}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={clsx('p-2.5 rounded-xl', card.bgClass)}>
                <Icon className={card.iconClass} size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
