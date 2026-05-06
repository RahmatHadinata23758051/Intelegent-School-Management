import clsx from 'clsx';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading data',
  endpoint = null,
  statusCode = null,
  onRetry = null,
  className,
}) => {
  // Parse error message for better context
  const getErrorContext = () => {
    if (statusCode === 403) {
      return 'You do not have permission to access this resource.';
    }
    if (statusCode === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (statusCode === 404) {
      return 'The requested resource was not found.';
    }
    if (statusCode === 500) {
      return 'A server error occurred. Please try again later.';
    }
    return message;
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <AlertCircle size={40} className="text-rose-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 text-center mb-2 max-w-md">{getErrorContext()}</p>
      
      {/* Error Details */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg max-w-md w-full">
        {endpoint && (
          <p className="text-xs text-slate-500 mb-2">
            <span className="font-semibold">Endpoint:</span> {endpoint}
          </p>
        )}
        {statusCode && (
          <p className="text-xs text-slate-500">
            <span className="font-semibold">Status:</span> {statusCode}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </Button>
        )}
        <Button
          variant="outline"
          size="md"
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
