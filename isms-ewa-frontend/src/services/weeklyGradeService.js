import api from './api';

/**
 * Weekly Grade Service
 * Handles all API calls related to weekly grades (nilai mingguan siswa)
 */
const weeklyGradeService = {
  /**
   * Get all weekly grades with filters
   * @param {Object} params - Query parameters (page, per_page, student_id, teacher_subject_assignment_id, 
   *                          teacher_profile_id, school_class_id, subject_id, grade_component_id, 
   *                          academic_year_id, semester_id, week_number, date_from, date_to, 
   *                          min_score, max_score, search, sort, sort_direction)
   * @returns {Promise} Response with weekly grades data
   */
  async getWeeklyGrades(params = {}) {
    const response = await api.get('/weekly-grades', { params });
    return response.data;
  },

  /**
   * Get single weekly grade by ID
   * @param {number} id - Weekly grade ID
   * @returns {Promise} Response with weekly grade data
   */
  async getWeeklyGrade(id) {
    const response = await api.get(`/weekly-grades/${id}`);
    return response.data;
  },

  /**
   * Create new weekly grade
   * @param {Object} data - Weekly grade data (student_id, teacher_subject_assignment_id, 
   *                        grade_component_id, academic_year_id, semester_id, week_number, 
   *                        assessment_date, score, notes)
   * @returns {Promise} Response with created weekly grade
   */
  async createWeeklyGrade(data) {
    const response = await api.post('/weekly-grades', data);
    return response.data;
  },

  /**
   * Update weekly grade
   * @param {number} id - Weekly grade ID
   * @param {Object} data - Updated weekly grade data (score, assessment_date, notes)
   * @returns {Promise} Response with updated weekly grade
   */
  async updateWeeklyGrade(id, data) {
    const response = await api.put(`/weekly-grades/${id}`, data);
    return response.data;
  },

  /**
   * Delete weekly grade
   * @param {number} id - Weekly grade ID
   * @returns {Promise} Response
   */
  async deleteWeeklyGrade(id) {
    const response = await api.delete(`/weekly-grades/${id}`);
    return response.data;
  },

  /**
   * Bulk store/update weekly grades
   * @param {Object} data - Bulk data (teacher_subject_assignment_id, grade_component_id, 
   *                        academic_year_id, semester_id, week_number, assessment_date, 
   *                        grades: [{student_id, score, notes}])
   * @returns {Promise} Response with bulk operation result
   */
  async bulkStoreWeeklyGrades(data) {
    const response = await api.post('/weekly-grades/bulk', data);
    return response.data;
  },

  /**
   * Get class weekly grades recap
   * @param {number} classId - School class ID
   * @param {Object} params - Query parameters (subject_id, teacher_profile_id, grade_component_id, 
   *                          academic_year_id, semester_id, week_number, date_from, date_to)
   * @returns {Promise} Response with class weekly grades recap
   */
  async getClassWeeklyGradesRecap(classId, params = {}) {
    const response = await api.get(`/classes/${classId}/weekly-grades`, { params });
    return response.data;
  },

  /**
   * Get student weekly grades recap
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (subject_id, grade_component_id, academic_year_id, 
   *                          semester_id, week_number, date_from, date_to)
   * @returns {Promise} Response with student weekly grades recap
   */
  async getStudentWeeklyGradesRecap(studentId, params = {}) {
    const response = await api.get(`/students/${studentId}/weekly-grades`, { params });
    return response.data;
  },

  /**
   * Get weekly grades summary
   * @param {Object} params - Query parameters (academic_year_id, semester_id)
   * @returns {Promise} Response with weekly grades summary
   */
  async getWeeklyGradesSummary(params = {}) {
    const response = await api.get('/weekly-grades/summary', { params });
    return response.data;
  },
};

export default weeklyGradeService;
