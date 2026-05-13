import clsx from 'clsx';

/**
 * Premium Loading Screen Component
 * Awwwards-inspired with smooth animations and gradient effects
 */
export const LoadingScreen = ({
  fullScreen = true,
  message = 'Loading...',
  variant = 'spinner',
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/90 backdrop-blur-md z-50'
    : 'relative w-full h-full bg-white/50';

  return (
    <div className={clsx(
      'flex items-center justify-center',
      containerClasses
    )}>
      <div className="flex flex-col items-center gap-5">
        {/* Premium Spinner with gradient */}
        {variant === 'spinner' && (
          <div className="relative w-14 h-14">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-lg animate-pulse" />
            {/* Base circle */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-600 animate-spin" 
                 style={{ animationDuration: '0.8s' }} />
            {/* Inner dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Premium Pulse variant with gradient */}
        {variant === 'pulse' && (
          <div className="flex gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full animate-pulse shadow-lg shadow-blue-500/30"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Premium Gradient variant */}
        {variant === 'gradient' && (
          <div className="relative w-14 h-14">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30 blur-xl animate-pulse" />
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 animate-spin" 
                 style={{ animationDuration: '1.5s' }} />
            {/* Inner white circle */}
            <div className="absolute inset-1 rounded-full bg-white" />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full" />
            </div>
          </div>
        )}

        {/* Message with better typography */}
        {message && (
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">{message}</p>
            <div className="mt-2 flex gap-1 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
