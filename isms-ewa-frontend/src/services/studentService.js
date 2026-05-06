import api from './api';

/**
 * Student Service
 * Menangani semua API calls untuk students
 */

export const studentService = {
  /**
   * Get list of students with filters
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search by name/student_id/email
   * @param {number} params.school_class_id - Filter by class
   * @param {string} params.risk_level - Filter by risk level (safe/warning/high_risk)
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.sort_by - Sort field (name/student_id/created_at)
   * @param {string} params.sort_dir - Sort direction (asc/desc)
   * @returns {Promise} Students list with pagination
   */
  getStudents: async (params = {}) => {
    try {
      const response = await api.get('/students', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get student detail by ID
   * @param {number} id - Student ID
   * @returns {Promise} Student detail data
   */
  getStudentDetail: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new student
   * @param {Object} data - Student data
   * @returns {Promise} Created student
   */
  createStudent: async (data) => {
    try {
      const response = await api.post('/students', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update student
   * @param {number} id - Student ID
   * @param {Object} data - Student data to update
   * @returns {Promise} Updated student
   */
  updateStudent: async (id, data) => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete student
   * @param {number} id - Student ID
   * @returns {Promise} Delete response
   */
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Recalculate student risk score
   * @param {number} id - Student ID
   * @returns {Promise} Updated risk score
   */
  recalculateRisk: async (id) => {
    try {
      const response = await api.post(`/students/${id}/recalculate-risk`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get student grades
   * @param {number} studentId - Student ID
   * @returns {Promise} Student grades
   */
  getStudentGrades: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/grades`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get student violations
   * @param {number} studentId - Student ID
   * @returns {Promise} Student violations
   */
  getStudentViolations: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/violations`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
