import api from './api';

/**
 * Grade Service
 * Menangani semua API calls untuk grades
 */

export const gradeService = {
  /**
   * Get grades untuk student tertentu
   * @param {number} studentId - ID student
   * @param {object} params - Query parameters (page, per_page, subject, semester, academic_year, sort_by, sort_direction)
   * @returns {Promise} Grades data
   */
  getGrades: async (studentId, params = {}) => {
    try {
      const response = await api.get(`/students/${studentId}/grades`, { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get detail grade tertentu
   * @param {number} studentId - ID student
   * @param {number} gradeId - ID grade
   * @returns {Promise} Grade detail
   */
  getGrade: async (studentId, gradeId) => {
    try {
      const response = await api.get(`/students/${studentId}/grades/${gradeId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create grade baru untuk student
   * @param {number} studentId - ID student
   * @param {object} data - Grade data (subject, score, semester, academic_year)
   * @returns {Promise} Created grade
   */
  createGrade: async (studentId, data) => {
    try {
      const response = await api.post(`/students/${studentId}/grades`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update grade tertentu
   * @param {number} studentId - ID student
   * @param {number} gradeId - ID grade
   * @param {object} data - Grade data yang diupdate
   * @returns {Promise} Updated grade
   */
  updateGrade: async (studentId, gradeId, data) => {
    try {
      const response = await api.put(`/students/${studentId}/grades/${gradeId}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete grade tertentu
   * @param {number} studentId - ID student
   * @param {number} gradeId - ID grade
   * @returns {Promise} Response
   */
  deleteGrade: async (studentId, gradeId) => {
    try {
      const response = await api.delete(`/students/${studentId}/grades/${gradeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
