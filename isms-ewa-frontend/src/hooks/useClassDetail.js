import { useState, useEffect } from 'react';
import { classService } from '../services/classService';

/**
 * Hook untuk fetch class detail
 */
export const useClassDetail = (classId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    if (!classId) {
      setError('Class ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await classService.getClassDetail(classId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load class detail');
      console.error('Class detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [classId]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetail,
  };
};
