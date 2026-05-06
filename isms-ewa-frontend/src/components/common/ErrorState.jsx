import clsx from 'clsx';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading data',
  onRetry = null,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-rose-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};
