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
      console.log('[LOGIN PAGE] Already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (formData) => {
    try {
      console.log('[LOGIN PAGE] Form submitted:', { email: formData.email });
      const result = await login(formData.email, formData.password);
      
      console.log('[LOGIN PAGE] Login result:', { success: result.success });
      
      if (result.success) {
        console.log('[LOGIN PAGE] Login successful, redirecting to dashboard');
        // Navigate after successful login
        navigate('/dashboard', { replace: true });
      } else {
        console.error('[LOGIN PAGE] Login failed:', result.error);
      }
    } catch (err) {
      console.error('[LOGIN PAGE] Unexpected error:', err);
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
