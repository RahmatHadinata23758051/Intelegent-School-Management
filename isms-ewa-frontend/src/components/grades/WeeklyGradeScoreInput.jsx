import { useState, useEffect } from 'react';
import clsx from 'clsx';

/**
 * Score input component for weekly grades
 * Validates score range (0-100) with visual feedback
 */
export const WeeklyGradeScoreInput = ({ 
  value, 
  onChange, 
  onBlur,
  disabled = false,
  error = null,
  placeholder = '0-100',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Validate
    if (newValue === '') {
      setIsInvalid(false);
      onChange('');
      return;
    }

    const numValue = parseFloat(newValue);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      onChange(numValue);
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        max="100"
        step="0.1"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          'w-full px-3 py-2 text-sm border rounded-lg transition-colors',
          'focus:outline-none focus:ring-2',
          {
            'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20': !isInvalid && !error,
            'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20': isInvalid || error,
            'bg-slate-50 text-slate-400 cursor-not-allowed': disabled,
            'bg-white': !disabled,
          },
          className
        )}
      />
      {(isInvalid || error) && (
        <p className="mt-1 text-xs text-rose-600">
          {error || 'Nilai harus antara 0-100'}
        </p>
      )}
    </div>
  );
};
