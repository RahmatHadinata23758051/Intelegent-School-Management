import api from './api';

/**
 * Teacher Subject Assignment Service
 * Handles all API calls for teacher-subject-class assignments
 */

export const teacherSubjectAssignmentService = {
  /**
   * Get all teacher subject assignments with filters and pagination
   */
  getTeacherSubjectAssignments: (params = {}) =>
    api.get('/teacher-subject-assignments', { params }),

  /**
   * Get single teacher subject assignment by ID
   */
  getTeacherSubjectAssignment: (id) =>
    api.get(`/teacher-subject-assignments/${id}`),

  /**
   * Create new teacher subject assignment
   */
  createTeacherSubjectAssignment: (data) =>
    api.post('/teacher-subject-assignments', data),

  /**
   * Update teacher subject assignment
   */
  updateTeacherSubjectAssignment: (id, data) =>
    api.put(`/teacher-subject-assignments/${id}`, data),

  /**
   * Delete teacher subject assignment
   */
  deleteTeacherSubjectAssignment: (id) =>
    api.delete(`/teacher-subject-assignments/${id}`),

  /**
   * Get subjects taught by a specific teacher
   */
  getSubjectsByTeacher: (teacherProfileId) =>
    api.get(`/teachers/${teacherProfileId}/subjects`),

  /**
   * Get classes where a teacher teaches
   */
  getClassesByTeacher: (teacherProfileId) =>
    api.get(`/teachers/${teacherProfileId}/classes`),

  /**
   * Assign teacher to a class-subject combination
   */
  assignTeacherToClassSubject: (teacherProfileId, classSubjectId, academicYearId) =>
    api.post(`/teachers/${teacherProfileId}/class-subjects/${classSubjectId}`, {
      academic_year_id: academicYearId,
    }),

  /**
   * Remove teacher from a class-subject combination
   */
  removeTeacherFromClassSubject: (teacherProfileId, classSubjectId, academicYearId) =>
    api.delete(`/teachers/${teacherProfileId}/class-subjects/${classSubjectId}`, {
      data: { academic_year_id: academicYearId },
    }),
};

export default teacherSubjectAssignmentService;
