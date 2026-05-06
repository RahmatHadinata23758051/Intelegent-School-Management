import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';

/**
 * Hook untuk fetch student detail
 */
export const useStudentDetail = (studentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    if (!studentId) {
      setError('Student ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await studentService.getStudentDetail(studentId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load student detail');
      console.error('Student detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [studentId]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetail,
  };
};
