import { useState, useCallback, useEffect } from 'react';
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

  // Filter and sort states
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState('created_at');

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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
      setError(err.message || 'An error occurred while fetching subjects');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, sort, pagination.per_page]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Create subject
  const create = useCallback(async (formData) => {
    try {
      const response = await subjectService.createSubject(formData);

      if (response.success) {
        await fetchSubjects();
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
        await fetchSubjects();
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
        await fetchSubjects();
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
  };
};
