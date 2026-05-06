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
      console.log('[dashboardService] Fetching statistics...');
      const response = await api.get('/dashboard/statistics');
      console.log('[dashboardService] Response received:', response);
      console.log('[dashboardService] Response data:', response.data);
      console.log('[dashboardService] Extracted data:', response.data.data);
      // Backend returns { success, message, data: {...} }
      return response.data.data;
    } catch (error) {
      console.error('[dashboardService] Error:', error);
      throw error.response?.data || error;
    }
  },
};
