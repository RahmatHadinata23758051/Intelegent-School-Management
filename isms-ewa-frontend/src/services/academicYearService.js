import api from './api';

/**
 * Academic Year Service
 * Menangani semua API calls untuk academic years
 */

export const academicYearService = {
  /**
   * Get list of academic years with filters
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search by year
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.sort_by - Sort field (year/start_date/created_at)
   * @param {string} params.sort_dir - Sort direction (asc/desc)
   * @returns {Promise} Academic years list with pagination
   */
  getAcademicYears: async (params = {}) => {
    try {
      const response = await api.get('/academic-years', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get academic year detail by ID
   * @param {number} id - Academic Year ID
   * @returns {Promise} Academic year detail data
   */
  getAcademicYear: async (id) => {
    try {
      const response = await api.get(`/academic-years/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new academic year
   * @param {Object} data - Academic year data
   * @param {string} data.year - Year format (YYYY/YYYY)
   * @param {string} data.start_date - Start date (YYYY-MM-DD)
   * @param {string} data.end_date - End date (YYYY-MM-DD)
   * @returns {Promise} Created academic year
   */
  createAcademicYear: async (data) => {
    try {
      const response = await api.post('/academic-years', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update academic year
   * @param {number} id - Academic Year ID
   * @param {Object} data - Academic year data to update
   * @returns {Promise} Updated academic year
   */
  updateAcademicYear: async (id, data) => {
    try {
      const response = await api.put(`/academic-years/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete academic year
   * @param {number} id - Academic Year ID
   * @returns {Promise} Delete response
   */
  deleteAcademicYear: async (id) => {
    try {
      const response = await api.delete(`/academic-years/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Activate academic year
   * @param {number} id - Academic Year ID
   * @returns {Promise} Activated academic year
   */
  activateAcademicYear: async (id) => {
    try {
      const response = await api.post(`/academic-years/${id}/activate`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get active academic year
   * @returns {Promise} Active academic year data
   */
  getActiveAcademicYear: async () => {
    try {
      const response = await api.get('/academic-years/active');
      return response.data.data;
    } catch (error) {
      // Return null if no active academic year found
      if (error.response?.status === 404) {
        return null;
      }
      throw error.response?.data || error;
    }
  },
};
