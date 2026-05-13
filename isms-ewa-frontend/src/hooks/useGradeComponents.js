import { useState, useCallback, useRef, useEffect } from 'react';
import gradeComponentService from '../services/gradeComponentService';

/**
 * Custom hook for managing grade components
 * Provides CRUD operations, filtering, and pagination
 */
export const useGradeComponents = (initialParams = {}) => {
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
    status: 'all',
    sort: 'sort_order',
    sort_direction: 'asc',
    ...initialParams,
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const abortControllerRef = useRef(null);

  /**
   * Fetch grade components
   */
  const fetchGradeComponents = useCallback(async (customParams = {}, skipLoading = false) => {
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
      const response = await gradeComponentService.getGradeComponents(mergedParams);
      
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
        setError(err.response?.data?.message || err.message || 'Gagal memuat komponen nilai');
        console.error('Error fetching grade components:', err);
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
      await fetchGradeComponents(params);
    }
  }, [hasInitialized, fetchGradeComponents, params]);

  /**
   * Create new grade component
   */
  const create = useCallback(async (componentData) => {
    try {
      setLoading(true);
      setError(null);
      
      await gradeComponentService.createGradeComponent(componentData);
      await fetchGradeComponents();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menyimpan komponen nilai';
      setError(errorMessage);
      console.error('Error creating grade component:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGradeComponents]);

  /**
   * Update grade component
   */
  const update = useCallback(async (id, componentData) => {
    try {
      setLoading(true);
      setError(null);
      
      await gradeComponentService.updateGradeComponent(id, componentData);
      await fetchGradeComponents();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memperbarui komponen nilai';
      setError(errorMessage);
      console.error('Error updating grade component:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGradeComponents]);

  /**
   * Delete grade component
   */
  const deleteComponent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await gradeComponentService.deleteGradeComponent(id);
      await fetchGradeComponents();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus komponen nilai';
      setError(errorMessage);
      console.error('Error deleting grade component:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGradeComponents]);

  /**
   * Update query parameters
   */
  const updateParams = useCallback((newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchGradeComponents(updatedParams);
  }, [params, fetchGradeComponents]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    fetchGradeComponents({ ...params, page });
  }, [params, fetchGradeComponents]);

  /**
   * Refetch with current params
   */
  const refetch = useCallback(() => {
    fetchGradeComponents(params);
  }, [params, fetchGradeComponents]);

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
    delete: deleteComponent,
    initialize,
    hasInitialized,
  };
};
