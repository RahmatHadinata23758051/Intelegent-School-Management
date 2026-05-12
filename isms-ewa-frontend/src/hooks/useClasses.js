import { useState, useEffect, useCallback, useRef } from 'react';
import { classService } from '../services/classService';

/**
 * Hook untuk fetch list of classes dengan filter dan pagination
 */
export const useClasses = (initialParams = {}) => {
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

  const fetchClasses = useCallback(async (queryParams = params, skipLoading = false) => {
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
      
      const result = await classService.getClasses(queryParams);
      setData(result);
      setParams(queryParams);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load classes');
        console.error('Classes error:', err);
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
      await fetchClasses(params);
    }
  }, [hasInitialized, fetchClasses, params]);

  // Auto-initialize for classes (they're often needed immediately)
  useEffect(() => {
    if (!hasInitialized) {
      initialize();
    }
  }, [hasInitialized, initialize]);

  const updateParams = useCallback((newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchClasses(updatedParams);
  }, [params, fetchClasses]);

  const goToPage = useCallback((page) => {
    fetchClasses({ ...params, page });
  }, [params, fetchClasses]);

  const refetch = useCallback(() => {
    fetchClasses(params);
  }, [params, fetchClasses]);

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
