import { useState, useCallback, useEffect, useRef } from 'react';
import { subjectService } from '../services/subjectService';

export const useSubjects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const abortControllerRef = useRef(null);

  // Filter and sort states
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState('created_at');

  // Fetch subjects
  const fetchSubjects = useCallback(async (skipLoading = false) => {
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

      const params = {
        search,
        status: filterStatus,
        sort,
        sort_direction: 'desc',
        per_page: pagination.per_page,
      };

      const response = await subjectService.getSubjects(params);

      if (response.success) {
        setData(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch subjects');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred while fetching subjects');
      }
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
    }
  }, [search, filterStatus, sort, pagination.per_page]);

  // Initialize fetch - only called once
  const initialize = useCallback(async () => {
    if (!hasInitialized) {
      setHasInitialized(true);
      await fetchSubjects();
    }
  }, [hasInitialized, fetchSubjects]);

  // Auto-initialize for subjects (they're often needed immediately)
  useEffect(() => {
    if (!hasInitialized) {
      initialize();
    }
  }, [hasInitialized, initialize]);

  // Fetch when filters change (but only after initialization)
  useEffect(() => {
    if (hasInitialized) {
      fetchSubjects();
    }
  }, [search, filterStatus, sort, hasInitialized, fetchSubjects]);

  // Create subject
  const create = useCallback(async (formData) => {
    try {
      const response = await subjectService.createSubject(formData);

      if (response.success) {
        await fetchSubjects(true);
        return response;
      } else {
        throw new Error(response.message || 'Failed to create subject');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchSubjects]);

  // Update subject
  const update = useCallback(async (id, formData) => {
    try {
      const response = await subjectService.updateSubject(id, formData);

      if (response.success) {
        await fetchSubjects(true);
        return response;
      } else {
        throw new Error(response.message || 'Failed to update subject');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchSubjects]);

  // Delete subject
  const deleteSubject = useCallback(async (id) => {
    try {
      const response = await subjectService.deleteSubject(id);

      if (response.success) {
        await fetchSubjects(true);
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete subject');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchSubjects]);

  // Refetch
  const refetch = useCallback(() => {
    fetchSubjects();
  }, [fetchSubjects]);

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
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    sort,
    setSort,
    refetch,
    create,
    update,
    delete: deleteSubject,
    initialize,
    hasInitialized,
  };
};
