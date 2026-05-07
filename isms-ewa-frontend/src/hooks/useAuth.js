import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    initializeAuth,
    login,
    logout,
    getCurrentUser,
    clearError,
    hasRole,
    hasAnyRole,
  } = useAuthStore();

  const initRef = useRef(false);

  // Initialize auth on mount only (not on every render)
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getCurrentUser,
    clearError,
    hasRole,
    hasAnyRole,
  };
};
