import { useState, useCallback } from 'react';
import attendanceService from '../services/attendanceService';

/**
 * Custom hook for attendance recap and summary
 * Provides class recap, student recap, and overall summary
 */
export const useAttendanceRecap = () => {
  const [classRecap, setClassRecap] = useState(null);
  const [studentRecap, setStudentRecap] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch class attendance recap
   */
  const fetchClassRecap = useCallback(async (classId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await attendanceService.getClassAttendanceRecap(classId, params);
      // Response format: { success, message, data: {...} }
      const responseData = response.data || null;
      setClassRecap(responseData);
      
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat rekap absensi kelas';
      setError(errorMessage);
      console.error('Error fetching class attendance recap:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch student attendance recap
   */
  const fetchStudentRecap = useCallback(async (studentId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await attendanceService.getStudentAttendanceRecap(studentId, params);
      // Response format: { success, message, data: {...} }
      const responseData = response.data || null;
      setStudentRecap(responseData);
      
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat rekap absensi siswa';
      setError(errorMessage);
      console.error('Error fetching student attendance recap:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch attendance summary
   */
  const fetchSummary = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await attendanceService.getAttendanceSummary(params);
      // Response format: { success, message, data: {...} }
      const responseData = response.data || null;
      setSummary(responseData);
      
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat ringkasan absensi';
      setError(errorMessage);
      console.error('Error fetching attendance summary:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all recap data
   */
  const clearRecap = useCallback(() => {
    setClassRecap(null);
    setStudentRecap(null);
    setSummary(null);
    setError(null);
  }, []);

  /**
   * Refetch last requested recap
   */
  const refetch = useCallback(() => {
    // This would need to store the last request params
    // For now, just clear error
    setError(null);
  }, []);

  return {
    classRecap,
    studentRecap,
    summary,
    loading,
    error,
    fetchClassRecap,
    fetchStudentRecap,
    fetchSummary,
    clearRecap,
    refetch,
  };
};
