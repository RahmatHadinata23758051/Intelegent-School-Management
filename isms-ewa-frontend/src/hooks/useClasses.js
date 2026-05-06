import { useState, useEffect } from 'react';
import { classService } from '../services/classService';

/**
 * Hook untuk fetch list of classes dengan filter dan pagination
 */
export const useClasses = (initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  const fetchClasses = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await classService.getClasses(queryParams);
      setData(result);
      setParams(queryParams);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      console.error('Classes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const updateParams = (newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchClasses(updatedParams);
  };

  const goToPage = (page) => {
    fetchClasses({ ...params, page });
  };

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refetch: () => fetchClasses(params),
  };
};
