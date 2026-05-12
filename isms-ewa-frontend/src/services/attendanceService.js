import api from './api';

/**
 * Attendance Service
 * Handles all API calls related to student attendances
 */
const attendanceService = {
  /**
   * Get all attendances with filters
   * @param {Object} params - Query parameters (page, per_page, attendance_session_id, student_id, status)
   * @returns {Promise} Response with attendances data
   */
  async getAttendances(params = {}) {
    const response = await api.get('/attendances', { params });
    return response.data;
  },

  /**
   * Get single attendance by ID
   * @param {number} id - Attendance ID
   * @returns {Promise} Response with attendance data
   */
  async getAttendance(id) {
    const response = await api.get(`/attendances/${id}`);
    return response.data;
  },

  /**
   * Create new attendance record
   * @param {Object} data - Attendance data (attendance_session_id, student_id, status, notes)
   * @returns {Promise} Response with created attendance
   */
  async createAttendance(data) {
    const response = await api.post('/attendances', data);
    return response.data;
  },

  /**
   * Update attendance record
   * @param {number} id - Attendance ID
   * @param {Object} data - Updated attendance data
   * @returns {Promise} Response with updated attendance
   */
  async updateAttendance(id, data) {
    const response = await api.put(`/attendances/${id}`, data);
    return response.data;
  },

  /**
   * Delete attendance record
   * @param {number} id - Attendance ID
   * @returns {Promise} Response
   */
  async deleteAttendance(id) {
    const response = await api.delete(`/attendances/${id}`);
    return response.data;
  },

  /**
   * Bulk store/update attendances for a session
   * @param {number} sessionId - Attendance session ID
   * @param {Array} attendances - Array of attendance objects [{student_id, status, notes}]
   * @returns {Promise} Response with bulk operation result
   */
  async bulkStoreAttendances(sessionId, attendances) {
    const response = await api.post(`/attendance-sessions/${sessionId}/attendances/bulk`, {
      attendances,
    });
    return response.data;
  },

  /**
   * Get class attendance recap
   * @param {number} classId - School class ID
   * @param {Object} params - Query parameters (academic_year_id, semester_id, date_from, date_to)
   * @returns {Promise} Response with class attendance recap
   */
  async getClassAttendanceRecap(classId, params = {}) {
    const response = await api.get(`/classes/${classId}/attendance`, { params });
    return response.data;
  },

  /**
   * Get student attendance recap
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (academic_year_id, semester_id, date_from, date_to)
   * @returns {Promise} Response with student attendance recap
   */
  async getStudentAttendanceRecap(studentId, params = {}) {
    const response = await api.get(`/students/${studentId}/attendance`, { params });
    return response.data;
  },

  /**
   * Get attendance summary
   * @param {Object} params - Query parameters (academic_year_id, semester_id, school_class_id, date_from, date_to)
   * @returns {Promise} Response with attendance summary
   */
  async getAttendanceSummary(params = {}) {
    const response = await api.get('/attendance/summary', { params });
    return response.data;
  },
};

export default attendanceService;
