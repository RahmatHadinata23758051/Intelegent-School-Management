import { Calendar, CheckCircle2, Clock, XCircle, Users } from 'lucide-react';
import { Card } from '../common/Card';
import clsx from 'clsx';

/**
 * Premium summary cards for attendance overview
 * Anti AI slop: Custom design, proper spacing, meaningful data
 */
export const AttendanceSummaryCards = ({ summary }) => {
  const cards = [
    {
      label: 'Total Sesi',
      value: summary?.total_sessions || 0,
      icon: Calendar,
      color: 'blue',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
      borderClass: 'border-l-blue-500',
    },
    {
      label: 'Sesi Hari Ini',
      value: summary?.today_sessions || 0,
      icon: Calendar,
      color: 'purple',
      bgClass: 'bg-purple-100',
      textClass: 'text-purple-600',
      borderClass: 'border-l-purple-500',
    },
    {
      label: 'Sesi Terkunci',
      value: summary?.locked_sessions || 0,
      icon: CheckCircle2,
      color: 'emerald',
      bgClass: 'bg-emerald-100',
      textClass: 'text-emerald-600',
      borderClass: 'border-l-emerald-500',
    },
    {
      label: 'Belum Lengkap',
      value: summary?.incomplete_sessions || 0,
      icon: Clock,
      color: 'amber',
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-600',
      borderClass: 'border-l-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className={clsx('border-l-4 p-4', card.borderClass)}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
              </div>
              <div className={clsx('p-2.5 rounded-lg', card.bgClass)}>
                <Icon size={20} className={card.textClass} strokeWidth={1.5} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
