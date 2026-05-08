import api from './api';

export const teacherProfileService = {
  /**
   * Get list of teacher profiles dengan pagination, search, filter, sort
   */
  async getTeachers(params = {}) {
    const response = await api.get('/teachers', { params });
    return response.data;
  },

  /**
   * Get single teacher profile detail
   */
  async getTeacher(id) {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  /**
   * Create new teacher profile
   */
  async createTeacher(data) {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  /**
   * Update teacher profile
   */
  async updateTeacher(id, data) {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  /**
   * Delete/deactivate teacher profile
   */
  async deleteTeacher(id) {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },

  /**
   * Get dropdown list of active teachers
   */
  async getTeacherDropdown() {
    const response = await api.get('/teachers/dropdown');
    return response.data;
  },

  /**
   * Get user candidates untuk create teacher profile (admin only)
   */
  async getTeacherCandidates() {
    const response = await api.get('/users/teacher-candidates');
    return response.data;
  },
};
