import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TableFooter - Pagination controls for data tables
 * 
 * Design: 16px height, 8pt grid spacing, semantic button styling
 */
export const TableFooter = ({ 
  currentPage = 1, 
  totalPages = 1,
  onPageChange = () => {}
}) => {
  return (
    <div className="flex h-16 items-center justify-between border-t border-slate-200 px-6">
      <div className="text-[13px] leading-5 text-slate-500">
        Menampilkan 1–5 dari 5 data
      </div>
      <div className="flex items-center gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
          <ChevronLeft size={16} />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-[13px] font-medium text-white">
          {currentPage}
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
