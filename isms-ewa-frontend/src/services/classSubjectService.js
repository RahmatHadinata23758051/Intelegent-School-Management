import api from './api';

const BASE_URL = '/class-subjects';

export const classSubjectService = {
  /**
   * Get all class subjects with pagination, search, filter, and sort
   */
  getClassSubjects: async (params = {}) => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get a specific class subject by ID
   */
  getClassSubject: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new class subject assignment
   */
  createClassSubject: async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  /**
   * Update a class subject (only is_active status)
   */
  updateClassSubject: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a class subject assignment
   */
  deleteClassSubject: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get all subjects for a specific class
   */
  getSubjectsByClass: async (classId, params = {}) => {
    const response = await api.get(`/classes/${classId}/subjects`, { params });
    return response.data;
  },

  /**
   * Get all classes for a specific subject
   */
  getClassesBySubject: async (subjectId, params = {}) => {
    const response = await api.get(`/subjects/${subjectId}/classes`, { params });
    return response.data;
  },

  /**
   * Assign a subject to a class (shortcut endpoint)
   */
  assignSubjectToClass: async (classId, subjectId) => {
    const response = await api.post(`/classes/${classId}/subjects/${subjectId}`);
    return response.data;
  },

  /**
   * Remove a subject from a class (shortcut endpoint)
   */
  removeSubjectFromClass: async (classId, subjectId) => {
    const response = await api.delete(`/classes/${classId}/subjects/${subjectId}`);
    return response.data;
  },
};

export default classSubjectService;
