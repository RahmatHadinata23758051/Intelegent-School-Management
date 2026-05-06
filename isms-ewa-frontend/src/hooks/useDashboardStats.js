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
      console.log('[useDashboardStats] Starting fetch...');
      setLoading(true);
      setError(null);
      const result = await dashboardService.getStatistics();
      console.log('[useDashboardStats] Fetch successful, result:', result);
      setData(result);
    } catch (err) {
      console.error('[useDashboardStats] Fetch failed:', err);
      setError(err.message || 'Failed to load dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      console.log('[useDashboardStats] useEffect triggered, shouldFetch:', shouldFetch);
      fetchStats();
    } else {
      console.log('[useDashboardStats] Skipping fetch, shouldFetch:', shouldFetch);
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
