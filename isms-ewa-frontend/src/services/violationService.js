import api from './api';

/**
 * Violation Service
 * Menangani semua API calls untuk violations
 */

export const violationService = {
  /**
   * Get violations untuk student tertentu
   * @param {number} studentId - ID student
   * @param {object} params - Query parameters (page, per_page, severity, reported_date, sort_by, sort_direction)
   * @returns {Promise} Violations data
   */
  getViolations: async (studentId, params = {}) => {
    try {
      const response = await api.get(`/students/${studentId}/violations`, { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get detail violation tertentu
   * @param {number} studentId - ID student
   * @param {number} violationId - ID violation
   * @returns {Promise} Violation detail
   */
  getViolation: async (studentId, violationId) => {
    try {
      const response = await api.get(`/students/${studentId}/violations/${violationId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create violation baru untuk student
   * @param {number} studentId - ID student
   * @param {object} data - Violation data (description, severity, reported_date, reported_by optional)
   * @returns {Promise} Created violation
   */
  createViolation: async (studentId, data) => {
    try {
      const response = await api.post(`/students/${studentId}/violations`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update violation tertentu
   * @param {number} studentId - ID student
   * @param {number} violationId - ID violation
   * @param {object} data - Violation data yang diupdate
   * @returns {Promise} Updated violation
   */
  updateViolation: async (studentId, violationId, data) => {
    try {
      const response = await api.put(`/students/${studentId}/violations/${violationId}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete violation tertentu
   * @param {number} studentId - ID student
   * @param {number} violationId - ID violation
   * @returns {Promise} Response
   */
  deleteViolation: async (studentId, violationId) => {
    try {
      const response = await api.delete(`/students/${studentId}/violations/${violationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
