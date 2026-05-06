import { useState } from 'react';
import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Alert } from '../common/Alert';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          title="Login Failed"
          message={error}
        />
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        icon={Mail}
      />

      {/* Password Input */}
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        icon={LockKeyhole}
      />

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-600">Remember me</span>
        </label>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
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
        className="w-full group"
      >
        <span>Sign In</span>
        {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
      </Button>

      {/* Demo Credentials Hint */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-slate-600">
          <span className="font-medium text-slate-700">Demo Credentials:</span>
        </p>
        <p className="text-xs text-slate-600 mt-1">
          Admin: <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-mono">admin@isms-ewa.local</code>
        </p>
        <p className="text-xs text-slate-600">
          Password: <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-mono">password</code>
        </p>
      </div>
    </form>
  );
};
