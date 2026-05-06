import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Navigate after successful login
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <AuthLayout>
      <LoginForm
        onSubmit={handleSubmit}
        loading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
};
