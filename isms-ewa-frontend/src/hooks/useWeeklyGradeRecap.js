import { useState, useCallback } from 'react';
import weeklyGradeService from '../services/weeklyGradeService';

/**
 * Custom hook for weekly grade recap and summary
 * Provides class recap, student recap, and overall summary
 */
export const useWeeklyGradeRecap = () => {
  const [classRecap, setClassRecap] = useState(null);
  const [studentRecap, setStudentRecap] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch class weekly grades recap
   */
  const fetchClassRecap = useCallback(async (classId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await weeklyGradeService.getClassWeeklyGradesRecap(classId, params);
      setClassRecap(response.data);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat rekap nilai kelas';
      setError(errorMessage);
      console.error('Error fetching class recap:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch student weekly grades recap
   */
  const fetchStudentRecap = useCallback(async (studentId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await weeklyGradeService.getStudentWeeklyGradesRecap(studentId, params);
      setStudentRecap(response.data);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat rekap nilai siswa';
      setError(errorMessage);
      console.error('Error fetching student recap:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch weekly grades summary
   */
  const fetchSummary = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await weeklyGradeService.getWeeklyGradesSummary(params);
      setSummary(response.data);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat ringkasan nilai';
      setError(errorMessage);
      console.error('Error fetching summary:', err);
      throw err;
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
  };
};
