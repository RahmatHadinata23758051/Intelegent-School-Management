import clsx from 'clsx';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value = '',
  onChange = () => {},
  onClear = () => {},
  placeholder = 'Search...',
  className,
}) => {
  return (
    <div className={clsx('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-10 pr-10"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
