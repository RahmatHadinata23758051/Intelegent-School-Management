import { useState, useCallback } from 'react';
import attendanceSessionService from '../services/attendanceSessionService';

/**
 * Custom hook for managing attendance sessions
 * Provides CRUD operations, lock/unlock, and filtering
 */
export const useAttendanceSessions = (initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [params, setParams] = useState({
    page: 1,
    per_page: 15,
    search: '',
    school_class_id: '',
    academic_year_id: '',
    semester_id: '',
    session_date_from: '',
    session_date_to: '',
    is_locked: '',
    sort: 'session_date',
    ...initialParams,
  });

  /**
   * Fetch attendance sessions
   */
  const fetchSessions = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...params, ...customParams };
      const response = await attendanceSessionService.getAttendanceSessions(mergedParams);
      
      setData(response.data || []);
      if (response.meta) {
        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat sesi absensi');
      console.error('Error fetching attendance sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Create new attendance session
   */
  const create = useCallback(async (sessionData) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceSessionService.createAttendanceSession(sessionData);
      await fetchSessions();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal membuat sesi absensi';
      setError(errorMessage);
      console.error('Error creating attendance session:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  /**
   * Update attendance session
   */
  const update = useCallback(async (id, sessionData) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceSessionService.updateAttendanceSession(id, sessionData);
      await fetchSessions();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui sesi absensi';
      setError(errorMessage);
      console.error('Error updating attendance session:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  /**
   * Delete attendance session
   */
  const deleteSession = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceSessionService.deleteAttendanceSession(id);
      await fetchSessions();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus sesi absensi';
      setError(errorMessage);
      console.error('Error deleting attendance session:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  /**
   * Lock attendance session
   */
  const lock = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceSessionService.lockAttendanceSession(id);
      await fetchSessions();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal mengunci sesi absensi';
      setError(errorMessage);
      console.error('Error locking attendance session:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  /**
   * Unlock attendance session (admin only)
   */
  const unlock = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceSessionService.unlockAttendanceSession(id);
      await fetchSessions();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal membuka kunci sesi absensi';
      setError(errorMessage);
      console.error('Error unlocking attendance session:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  /**
   * Update query parameters
   */
  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Refetch with current params
   */
  const refetch = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    data,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    refetch,
    create,
    update,
    delete: deleteSession,
    lock,
    unlock,
  };
};
