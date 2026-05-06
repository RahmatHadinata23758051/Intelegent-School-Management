import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export const SelectFilter = ({
  label = '',
  value = '',
  onChange = () => {},
  options = [],
  placeholder = 'Select...',
  className,
}) => {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            'input-base appearance-none pr-10',
            'bg-white'
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};
