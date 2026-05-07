import { Component } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

/**
 * Error Boundary Component
 * Menangkap render error dan menampilkan fallback UI yang rapi
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error untuk debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      const { error, errorInfo, errorCount } = this.state;

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-sm">
                <AlertCircle size={40} className="text-rose-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Oops! Terjadi Kesalahan
            </h1>

            {/* Error Message */}
            <p className="text-sm text-slate-600 text-center mb-6">
              Aplikasi mengalami masalah yang tidak terduga. Silakan coba lagi atau kembali ke dashboard.
            </p>

            {/* Error Details (Development Only) */}
            {isDevelopment && error && (
              <div className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-xs font-mono text-slate-700 mb-2 font-semibold">
                  Error Details:
                </p>
                <p className="text-xs text-slate-600 font-mono break-words mb-2">
                  {error.toString()}
                </p>
                {errorInfo && (
                  <details className="text-xs text-slate-600">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Stack Trace
                    </summary>
                    <pre className="text-xs overflow-auto max-h-40 bg-slate-50 p-2 rounded border border-slate-300">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Error Count Warning */}
            {errorCount > 2 && (
              <div className="mb-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700">
                  ⚠️ Error terjadi {errorCount} kali. Silakan reload halaman.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 w-full"
              >
                <RotateCcw size={16} />
                Reload Halaman
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 w-full"
              >
                <Home size={16} />
                Kembali ke Dashboard
              </Button>
            </div>

            {/* Additional Help Text */}
            <p className="text-xs text-slate-500 text-center mt-6">
              Jika masalah terus berlanjut, silakan hubungi administrator sistem.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
