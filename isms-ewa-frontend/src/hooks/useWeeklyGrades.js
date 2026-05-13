import { useState, useCallback, useRef, useEffect } from 'react';
import weeklyGradeService from '../services/weeklyGradeService';

/**
 * Custom hook for managing weekly grades
 * Provides CRUD operations, bulk save, filtering, and pagination
 */
export const useWeeklyGrades = (initialParams = {}) => {
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
    student_id: '',
    teacher_subject_assignment_id: '',
    teacher_profile_id: '',
    school_class_id: '',
    subject_id: '',
    grade_component_id: '',
    academic_year_id: '',
    semester_id: '',
    week_number: '',
    date_from: '',
    date_to: '',
    min_score: '',
    max_score: '',
    sort: 'created_at',
    sort_direction: 'desc',
    ...initialParams,
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const abortControllerRef = useRef(null);

  /**
   * Fetch weekly grades
   */
  const fetchWeeklyGrades = useCallback(async (customParams = {}, skipLoading = false) => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      if (!skipLoading) {
        setLoading(true);
      }
      setError(null);
      
      const mergedParams = { ...params, ...customParams };
      const response = await weeklyGradeService.getWeeklyGrades(mergedParams);
      
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
      
      setParams(mergedParams);
    } catch (err) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        setError(err.response?.data?.message || err.message || 'Gagal memuat nilai mingguan');
        console.error('Error fetching weekly grades:', err);
      }
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
    }
  }, [params]);

  /**
   * Initialize fetch - only called once
   */
  const initialize = useCallback(async () => {
    if (!hasInitialized) {
      setHasInitialized(true);
      await fetchWeeklyGrades(params);
    }
  }, [hasInitialized, fetchWeeklyGrades, params]);

  /**
   * Create new weekly grade
   */
  const create = useCallback(async (gradeData) => {
    try {
      setLoading(true);
      setError(null);
      
      await weeklyGradeService.createWeeklyGrade(gradeData);
      await fetchWeeklyGrades();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menyimpan nilai';
      setError(errorMessage);
      console.error('Error creating weekly grade:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWeeklyGrades]);

  /**
   * Update weekly grade
   */
  const update = useCallback(async (id, gradeData) => {
    try {
      setLoading(true);
      setError(null);
      
      await weeklyGradeService.updateWeeklyGrade(id, gradeData);
      await fetchWeeklyGrades();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui nilai';
      setError(errorMessage);
      console.error('Error updating weekly grade:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWeeklyGrades]);

  /**
   * Delete weekly grade
   */
  const deleteGrade = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await weeklyGradeService.deleteWeeklyGrade(id);
      await fetchWeeklyGrades();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus nilai';
      setError(errorMessage);
      console.error('Error deleting weekly grade:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWeeklyGrades]);

  /**
   * Bulk save weekly grades
   */
  const bulkSave = useCallback(async (bulkData) => {
    try {
      setLoading(true);
      setError(null);
      
      await weeklyGradeService.bulkStoreWeeklyGrades(bulkData);
      await fetchWeeklyGrades();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menyimpan nilai';
      setError(errorMessage);
      console.error('Error bulk saving weekly grades:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWeeklyGrades]);

  /**
   * Update query parameters
   */
  const updateParams = useCallback((newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchWeeklyGrades(updatedParams);
  }, [params, fetchWeeklyGrades]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    fetchWeeklyGrades({ ...params, page });
  }, [params, fetchWeeklyGrades]);

  /**
   * Refetch with current params
   */
  const refetch = useCallback(() => {
    fetchWeeklyGrades(params);
  }, [params, fetchWeeklyGrades]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    delete: deleteGrade,
    bulkSave,
    initialize,
    hasInitialized,
  };
};
