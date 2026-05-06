import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';

/**
 * Hook untuk fetch list of students dengan filter dan pagination
 */
export const useStudents = (initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  const fetchStudents = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.getStudents(queryParams);
      setData(result);
      setParams(queryParams);
    } catch (err) {
      setError(err.message || 'Failed to load students');
      console.error('Students error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const updateParams = (newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchStudents(updatedParams);
  };

  const goToPage = (page) => {
    fetchStudents({ ...params, page });
  };

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refetch: () => fetchStudents(params),
  };
};
