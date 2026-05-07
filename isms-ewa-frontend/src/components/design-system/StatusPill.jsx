import clsx from 'clsx';

/**
 * StatusPill - Semantic status badge with color coding
 * 
 * Design: 12px padding, 8px border-radius, semantic colors
 * Supports: Aktif, Berjalan, Kritis, Risiko Tinggi, Waspada, Arsip, Selesai, Akan Datang, Dijadwalkan
 */
export const StatusPill = ({ status }) => {
  const toneMap = {
    'Aktif': 'bg-emerald-50 text-emerald-700',
    'Berjalan': 'bg-emerald-50 text-emerald-700',
    'Kritis': 'bg-rose-50 text-rose-700',
    'Risiko Tinggi': 'bg-orange-50 text-orange-700',
    'Waspada': 'bg-amber-50 text-amber-700',
    'Arsip': 'bg-slate-100 text-slate-600',
    'Selesai': 'bg-slate-100 text-slate-600',
    'Akan Datang': 'bg-blue-50 text-blue-700',
    'Dijadwalkan': 'bg-blue-50 text-blue-700',
  };

  const tone = toneMap[status] || 'bg-slate-100 text-slate-600';

  return (
    <span className={clsx(
      'inline-flex rounded-full px-3 py-1 text-[12px] font-medium leading-4',
      tone
    )}>
      {status}
    </span>
  );
};
