import api from './api';

/**
 * Semester Service
 * Menangani semua API calls untuk semesters
 */

export const semesterService = {
  /**
   * Get list of semesters with filters
   * @param {Object} params - Query parameters
   * @param {number} params.academic_year_id - Filter by academic year
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.sort_by - Sort field (semester_number/start_date/created_at)
   * @param {string} params.sort_dir - Sort direction (asc/desc)
   * @returns {Promise} Semesters list with pagination
   */
  getSemesters: async (params = {}) => {
    try {
      const response = await api.get('/semesters', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get semester detail by ID
   * @param {number} id - Semester ID
   * @returns {Promise} Semester detail data
   */
  getSemester: async (id) => {
    try {
      const response = await api.get(`/semesters/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new semester
   * @param {Object} data - Semester data
   * @param {number} data.academic_year_id - Academic year ID
   * @param {number} data.semester_number - Semester number (1 or 2)
   * @param {string} data.start_date - Start date (YYYY-MM-DD)
   * @param {string} data.end_date - End date (YYYY-MM-DD)
   * @returns {Promise} Created semester
   */
  createSemester: async (data) => {
    try {
      const response = await api.post('/semesters', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update semester
   * @param {number} id - Semester ID
   * @param {Object} data - Semester data to update
   * @returns {Promise} Updated semester
   */
  updateSemester: async (id, data) => {
    try {
      const response = await api.put(`/semesters/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete semester
   * @param {number} id - Semester ID
   * @returns {Promise} Delete response
   */
  deleteSemester: async (id) => {
    try {
      const response = await api.delete(`/semesters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Activate semester
   * @param {number} id - Semester ID
   * @returns {Promise} Activated semester
   */
  activateSemester: async (id) => {
    try {
      const response = await api.post(`/semesters/${id}/activate`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get active semester
   * @returns {Promise} Active semester data
   */
  getActiveSemester: async () => {
    try {
      const response = await api.get('/semesters/active');
      return response.data.data;
    } catch (error) {
      // Return null if no active semester found
      if (error.response?.status === 404) {
        return null;
      }
      throw error.response?.data || error;
    }
  },

  /**
   * Get semesters by academic year
   * @param {number} academicYearId - Academic year ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise} Semesters list for the academic year
   */
  getSemestersByAcademicYear: async (academicYearId, params = {}) => {
    try {
      const response = await api.get(`/academic-years/${academicYearId}/semesters`, { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
