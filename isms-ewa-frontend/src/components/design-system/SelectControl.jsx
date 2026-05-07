import { ChevronDown, Filter } from 'lucide-react';
import clsx from 'clsx';

/**
 * SelectControl - Dropdown select component
 * 
 * Design: 44px height (11px grid), 8px border-radius, semantic colors
 */
export const SelectControl = ({ 
  label, 
  value, 
  icon: Icon = Filter,
  onChange = () => {}
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <div className="text-[13px] font-medium leading-5 text-slate-600">
          {label}
        </div>
      )}
      <button className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-200 bg-[#FAFBFD] px-4 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50">
        <span className="inline-flex items-center gap-3">
          <Icon size={17} className="text-slate-500" />
          {value}
        </span>
        <ChevronDown size={17} className="text-slate-500" />
      </button>
    </div>
  );
};
