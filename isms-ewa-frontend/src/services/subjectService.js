import api from './api';

export const subjectService = {
  /**
   * Get list of subjects with pagination, search, filter, and sort
   */
  getSubjects: async (params = {}) => {
    const response = await api.get('/subjects', { params });
    return response.data;
  },

  /**
   * Get a single subject by ID
   */
  getSubject: async (id) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  /**
   * Create a new subject
   */
  createSubject: async (data) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  /**
   * Update an existing subject
   */
  updateSubject: async (id, data) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  /**
   * Delete a subject
   */
  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  /**
   * Get dropdown list of active subjects
   */
  getSubjectDropdown: async () => {
    const response = await api.get('/subjects/dropdown');
    return response.data;
  },
};
