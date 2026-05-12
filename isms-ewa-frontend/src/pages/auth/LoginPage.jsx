import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CerdikLogo from '../../assets/Cerdik.png';
import SekolahBg from '../../assets/Sekolah-bg.png';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error: authError, login } = useAuth();

  const [email, setEmail] = useState('admin@isms-ewa.local');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Update error from auth store
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const result = await login(email, password);

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${SekolahBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content - Centered */}
      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Login Card */}
        <div className="rounded-2xl border border-white/20 bg-white/97 backdrop-blur-lg px-7 py-8 shadow-2xl">
          {/* Logo Section - Inside Card */}
          <div className="mb-4 flex flex-col items-center gap-2">
            <img 
              src={CerdikLogo} 
              alt="ISMS-EWA Logo" 
              className="h-14 w-auto"
            />
            <div className="text-center">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                SMA Cendekia Nusantara
              </h2>
              <p className="text-xs text-slate-500">
                Intelligent School Management System
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-slate-200" />

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Sign in to your school account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div>
                <p className="text-xs font-semibold text-red-900">Login failed</p>
                <p className="mt-0.5 text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@isms-ewa.local"
                className="w-full h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && (
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Demo Credentials */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800">
                Demo credentials
              </p>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                Testing
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <CredentialRow
                label="Admin"
                value="admin@isms-ewa.local"
              />
              <CredentialRow
                label="Teacher"
                value="teacher@isms-ewa.local"
              />
              <CredentialRow label="Password" value="password" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-white/70">
          Protected school analytics workspace
        </p>
      </div>
    </main>
  );
};

function CredentialRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-600">{label}</span>
      <code className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700">
        {value}
      </code>
    </div>
  );
}
