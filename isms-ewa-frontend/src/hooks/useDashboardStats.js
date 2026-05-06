import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

/**
 * Hook untuk fetch dashboard statistics
 */
export const useDashboardStats = (shouldFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getStatistics();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [shouldFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
};
