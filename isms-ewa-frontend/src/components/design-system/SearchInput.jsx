import { Search } from 'lucide-react';
import clsx from 'clsx';

/**
 * SearchInput - Search field component
 * 
 * Design: 44px height, 8px border-radius, icon prefix
 */
export const SearchInput = ({ 
  placeholder = 'Search...', 
  value = '',
  onChange = () => {},
  className = '' 
}) => {
  return (
    <div className={clsx(
      'flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-[#FAFBFD] px-4 text-[14px] text-slate-500 transition hover:border-slate-300',
      className
    )}>
      <Search size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
      />
    </div>
  );
};
