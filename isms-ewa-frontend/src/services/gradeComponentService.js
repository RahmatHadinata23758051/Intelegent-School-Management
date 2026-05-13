import api from './api';

/**
 * Grade Component Service
 * Handles all API calls related to grade components (Tugas, Quiz, UTS, UAS, etc.)
 */
const gradeComponentService = {
  /**
   * Get all grade components with filters
   * @param {Object} params - Query parameters (page, per_page, search, status, sort, sort_direction)
   * @returns {Promise} Response with grade components data
   */
  async getGradeComponents(params = {}) {
    const response = await api.get('/grade-components', { params });
    return response.data;
  },

  /**
   * Get single grade component by ID
   * @param {number} id - Grade component ID
   * @returns {Promise} Response with grade component data
   */
  async getGradeComponent(id) {
    const response = await api.get(`/grade-components/${id}`);
    return response.data;
  },

  /**
   * Create new grade component
   * @param {Object} data - Grade component data (code, name, description, default_weight, is_active, sort_order)
   * @returns {Promise} Response with created grade component
   */
  async createGradeComponent(data) {
    const response = await api.post('/grade-components', data);
    return response.data;
  },

  /**
   * Update grade component
   * @param {number} id - Grade component ID
   * @param {Object} data - Updated grade component data
   * @returns {Promise} Response with updated grade component
   */
  async updateGradeComponent(id, data) {
    const response = await api.put(`/grade-components/${id}`, data);
    return response.data;
  },

  /**
   * Delete grade component
   * @param {number} id - Grade component ID
   * @returns {Promise} Response
   */
  async deleteGradeComponent(id) {
    const response = await api.delete(`/grade-components/${id}`);
    return response.data;
  },

  /**
   * Get grade components dropdown (active only, minimal data)
   * @returns {Promise} Response with dropdown options
   */
  async getGradeComponentDropdown() {
    const response = await api.get('/grade-components/dropdown');
    return response.data;
  },

  /**
   * Get active grade components
   * @returns {Promise} Response with active grade components
   */
  async getActiveGradeComponents() {
    const response = await api.get('/grade-components/active');
    return response.data;
  },
};

export default gradeComponentService;
