import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth from localStorage
  initializeAuth: () => {
    set({ isLoading: true });
    
    try {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      console.log('[AUTH] Login attempt:', { email, apiUrl: import.meta.env.VITE_API_BASE_URL });
      
      const response = await authAPI.login(email, password);
      console.log('[AUTH] Login response:', response);
      
      // Backend returns { token, user } directly in response.data
      const { token, user } = response.data;

      if (!token || !user) {
        console.error('[AUTH] Missing token or user:', { token: !!token, user: !!user });
        throw new Error('Invalid response: missing token or user data');
      }

      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('[AUTH] Login successful:', { userId: user.id, role: user.role });

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      console.error('[AUTH] Login error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please try again.';

      set({
        isLoading: false,
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });

    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const { token } = get();

    if (!token) {
      return null;
    }

    set({ isLoading: true });

    try {
      const response = await authAPI.me();
      // /api/auth/me returns user directly in response.data, not wrapped
      const user = response.data;

      set({
        user,
        isLoading: false,
      });

      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);

      // If 401, clear auth
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }

      set({ isLoading: false });
      return null;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Check if user has role
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  // Check if user has any of the roles
  hasAnyRole: (roles) => {
    const { user } = get();
    return roles.includes(user?.role);
  },
}));
