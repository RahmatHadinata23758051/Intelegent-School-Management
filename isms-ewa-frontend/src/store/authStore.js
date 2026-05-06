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
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data.data;

      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
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
      const user = response.data.data;

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
