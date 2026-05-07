import { useState } from 'react';
import { Mail, LockKeyhole, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-900">Login Failed</p>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            placeholder="admin@isms-ewa.local"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              validationErrors.email
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          />
        </div>
        {validationErrors.email && (
          <p className="text-xs text-rose-600 mt-1.5">{validationErrors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>
        <div className="relative">
          <LockKeyhole size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              validationErrors.password
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          />
        </div>
        {validationErrors.password && (
          <p className="text-xs text-rose-600 mt-1.5">{validationErrors.password}</p>
        )}
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm pt-1">
        <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-slate-600">Remember me</span>
        </label>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={loading}
        className="w-full group mt-6"
      >
        <span>Sign In</span>
        {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
      </Button>

      {/* Demo Credentials Hint */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100 space-y-2">
        <p className="text-xs font-semibold text-slate-700">
          📝 Demo Credentials
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Admin:</span>
            <code className="text-xs bg-white px-2.5 py-1 rounded border border-blue-200 text-blue-700 font-mono font-medium">
              admin@isms-ewa.local
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Teacher:</span>
            <code className="text-xs bg-white px-2.5 py-1 rounded border border-blue-200 text-blue-700 font-mono font-medium">
              teacher@isms-ewa.local
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Password:</span>
            <code className="text-xs bg-white px-2.5 py-1 rounded border border-blue-200 text-blue-700 font-mono font-medium">
              password
            </code>
          </div>
        </div>
      </div>
    </form>
  );
};
