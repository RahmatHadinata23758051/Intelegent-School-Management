import { useState, useEffect } from 'react';
import { semesterService } from '../services/semesterService';

/**
 * Hook untuk fetch list of semesters dengan filter dan pagination
 */
export const useSemesters = (initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  const fetchSemesters = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await semesterService.getSemesters(queryParams);
      setData(result);
      setParams(queryParams);
    } catch (err) {
      setError(err.message || 'Gagal memuat semester');
      console.error('Semesters error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const updateParams = (newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchSemesters(updatedParams);
  };

  const goToPage = (page) => {
    fetchSemesters({ ...params, page });
  };

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refetch: () => fetchSemesters(params),
  };
};
