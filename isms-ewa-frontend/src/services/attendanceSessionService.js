import api from './api';

/**
 * Attendance Session Service
 * Handles all API calls related to attendance sessions
 */
const attendanceSessionService = {
  /**
   * Get all attendance sessions with filters
   * @param {Object} params - Query parameters (page, per_page, search, school_class_id, academic_year_id, semester_id, session_date_from, session_date_to, is_locked)
   * @returns {Promise} Response with attendance sessions data
   */
  async getAttendanceSessions(params = {}) {
    const response = await api.get('/attendance-sessions', { params });
    return response.data;
  },

  /**
   * Get single attendance session by ID
   * @param {number} id - Attendance session ID
   * @returns {Promise} Response with attendance session data
   */
  async getAttendanceSession(id) {
    const response = await api.get(`/attendance-sessions/${id}`);
    return response.data;
  },

  /**
   * Create new attendance session
   * @param {Object} data - Attendance session data (school_class_id, academic_year_id, semester_id, session_date, session_type, notes)
   * @returns {Promise} Response with created attendance session
   */
  async createAttendanceSession(data) {
    const response = await api.post('/attendance-sessions', data);
    return response.data;
  },

  /**
   * Update attendance session
   * @param {number} id - Attendance session ID
   * @param {Object} data - Updated attendance session data
   * @returns {Promise} Response with updated attendance session
   */
  async updateAttendanceSession(id, data) {
    const response = await api.put(`/attendance-sessions/${id}`, data);
    return response.data;
  },

  /**
   * Delete attendance session
   * @param {number} id - Attendance session ID
   * @returns {Promise} Response
   */
  async deleteAttendanceSession(id) {
    const response = await api.delete(`/attendance-sessions/${id}`);
    return response.data;
  },

  /**
   * Lock attendance session (prevent further edits)
   * @param {number} id - Attendance session ID
   * @returns {Promise} Response with locked session
   */
  async lockAttendanceSession(id) {
    const response = await api.post(`/attendance-sessions/${id}/lock`);
    return response.data;
  },

  /**
   * Unlock attendance session (admin only)
   * @param {number} id - Attendance session ID
   * @returns {Promise} Response with unlocked session
   */
  async unlockAttendanceSession(id) {
    const response = await api.post(`/attendance-sessions/${id}/unlock`);
    return response.data;
  },
};

export default attendanceSessionService;
