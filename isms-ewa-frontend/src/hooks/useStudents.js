import { useState, useEffect, useCallback, useRef } from 'react';
import { studentService } from '../services/studentService';

/**
 * Hook untuk fetch list of students dengan filter dan pagination
 */
export const useStudents = (initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    ...initialParams,
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchStudents = useCallback(async (queryParams = params, skipLoading = false) => {
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
      
      const result = await studentService.getStudents(queryParams);
      setData(result);
      setParams(queryParams);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load students');
        console.error('Students error:', err);
      }
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Initialize fetch - only called once
  const initialize = useCallback(async () => {
    if (!hasInitialized) {
      setHasInitialized(true);
      await fetchStudents(params);
    }
  }, [hasInitialized, fetchStudents, params]);

  const updateParams = useCallback((newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchStudents(updatedParams);
  }, [params, fetchStudents]);

  const goToPage = useCallback((page) => {
    fetchStudents({ ...params, page });
  }, [params, fetchStudents]);

  const refetch = useCallback(() => {
    fetchStudents(params);
  }, [params, fetchStudents]);

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
    params,
    updateParams,
    goToPage,
    refetch,
    initialize,
    hasInitialized,
  };
};
