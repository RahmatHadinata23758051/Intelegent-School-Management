import clsx from 'clsx';

export const LoadingScreen = ({
  fullScreen = true,
  message = 'Loading...',
  variant = 'spinner',
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm'
    : 'relative w-full h-full bg-white/50';

  return (
    <div className={clsx(
      'flex items-center justify-center',
      containerClasses
    )}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        {variant === 'spinner' && (
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" />
          </div>
        )}

        {/* Pulse variant */}
        {variant === 'pulse' && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Gradient variant */}
        {variant === 'gradient' && (
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 animate-spin" />
            <div className="absolute inset-1 rounded-full bg-white" />
          </div>
        )}

        {/* Message */}
        {message && (
          <p className="text-sm font-medium text-slate-600">{message}</p>
        )}
      </div>
    </div>
  );
};
