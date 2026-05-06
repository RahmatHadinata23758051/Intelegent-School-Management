import api from './api';

/**
 * Class Service
 * Menangani semua API calls untuk school classes
 */

export const classService = {
  /**
   * Get list of classes with filters
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search by name/grade_level
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.sort_by - Sort field (name/grade_level/created_at)
   * @param {string} params.sort_dir - Sort direction (asc/desc)
   * @returns {Promise} Classes list with pagination
   */
  getClasses: async (params = {}) => {
    try {
      const response = await api.get('/school-classes', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get class detail by ID
   * @param {number} id - Class ID
   * @returns {Promise} Class detail data
   */
  getClassDetail: async (id) => {
    try {
      const response = await api.get(`/school-classes/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new class
   * @param {Object} data - Class data
   * @returns {Promise} Created class
   */
  createClass: async (data) => {
    try {
      const response = await api.post('/school-classes', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update class
   * @param {number} id - Class ID
   * @param {Object} data - Class data to update
   * @returns {Promise} Updated class
   */
  updateClass: async (id, data) => {
    try {
      const response = await api.put(`/school-classes/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete class
   * @param {number} id - Class ID
   * @returns {Promise} Delete response
   */
  deleteClass: async (id) => {
    try {
      const response = await api.delete(`/school-classes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
