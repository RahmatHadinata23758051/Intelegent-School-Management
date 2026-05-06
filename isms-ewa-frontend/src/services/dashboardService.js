import api from './api';

/**
 * Dashboard Service
 * Menangani semua API calls untuk dashboard
 */

export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard statistics data
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/dashboard/statistics');
      // Backend returns data directly in response.data
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
