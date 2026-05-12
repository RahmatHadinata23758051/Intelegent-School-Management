import { useState, useCallback } from 'react';
import attendanceService from '../services/attendanceService';

/**
 * Custom hook for managing student attendances
 * Provides CRUD operations and bulk save
 */
export const useAttendances = (sessionId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
  });
  const [params, setParams] = useState({
    page: 1,
    per_page: 50,
    attendance_session_id: sessionId || '',
    student_id: '',
    status: '',
  });

  /**
   * Fetch attendances
   */
  const fetchAttendances = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...params, ...customParams };
      const response = await attendanceService.getAttendances(mergedParams);
      
      // Response format: { success, message, data: { data: [...], meta: {...} } }
      const responseData = response.data || {};
      setData(responseData.data || []);
      
      if (responseData.meta) {
        setPagination({
          current_page: responseData.meta.current_page,
          last_page: responseData.meta.last_page,
          per_page: responseData.meta.per_page,
          total: responseData.meta.total,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat data absensi');
      console.error('Error fetching attendances:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Create new attendance
   */
  const create = useCallback(async (attendanceData) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceService.createAttendance(attendanceData);
      await fetchAttendances();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menyimpan absensi';
      setError(errorMessage);
      console.error('Error creating attendance:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAttendances]);

  /**
   * Update attendance
   */
  const update = useCallback(async (id, attendanceData) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceService.updateAttendance(id, attendanceData);
      await fetchAttendances();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui absensi';
      setError(errorMessage);
      console.error('Error updating attendance:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAttendances]);

  /**
   * Delete attendance
   */
  const deleteAttendance = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceService.deleteAttendance(id);
      await fetchAttendances();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus absensi';
      setError(errorMessage);
      console.error('Error deleting attendance:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAttendances]);

  /**
   * Bulk save attendances for a session
   */
  const bulkSave = useCallback(async (sessionId, attendances) => {
    try {
      setLoading(true);
      setError(null);
      
      await attendanceService.bulkStoreAttendances(sessionId, attendances);
      await fetchAttendances();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menyimpan absensi';
      setError(errorMessage);
      console.error('Error bulk saving attendances:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAttendances]);

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
    fetchAttendances();
  }, [fetchAttendances]);

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
    delete: deleteAttendance,
    bulkSave,
  };
};
