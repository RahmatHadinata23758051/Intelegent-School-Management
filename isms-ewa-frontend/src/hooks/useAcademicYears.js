import { useState, useEffect } from 'react';
import { academicYearService } from '../services/academicYearService';

/**
 * Hook untuk fetch list of academic years dengan filter dan pagination
 */
export const useAcademicYears = (initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  const fetchAcademicYears = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await academicYearService.getAcademicYears(queryParams);
      setData(result);
      setParams(queryParams);
    } catch (err) {
      setError(err.message || 'Gagal memuat tahun ajaran');
      console.error('Academic years error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const updateParams = (newParams) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    fetchAcademicYears(updatedParams);
  };

  const goToPage = (page) => {
    fetchAcademicYears({ ...params, page });
  };

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refetch: () => fetchAcademicYears(params),
  };
};
