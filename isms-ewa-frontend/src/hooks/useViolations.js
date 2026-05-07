import { useState, useCallback } from 'react';
import { violationService } from '../services/violationService';

/**
 * Hook untuk manage violations
 * @param {number} studentId - ID student
 * @param {function} onMutationSuccess - Callback setelah mutation sukses (untuk refresh risk score, dll)
 */
export const useViolations = (studentId, onMutationSuccess = null) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState({
    severity: '',
    reported_date: '',
  });
  const [sorting, setSorting] = useState({
    sort_by: 'created_at',
    sort_direction: 'desc',
  });

  /**
   * Fetch violations
   */
  const fetchViolations = useCallback(
    async (page = 1, customFilters = null, customSorting = null) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          per_page: pagination.per_page,
          ...(customFilters || filters),
          ...(customSorting || sorting),
        };

        const response = await violationService.getViolations(studentId, params);

        // Handle paginated response
        if (response.data && Array.isArray(response.data)) {
          setViolations(response.data);
          if (response.meta) {
            setPagination(response.meta);
          }
        } else if (Array.isArray(response)) {
          setViolations(response);
        }
      } catch (err) {
        setError(err.message || 'Failed to load violations');
        console.error('Fetch violations error:', err);
      } finally {
        setLoading(false);
      }
    },
    [studentId, filters, sorting, pagination.per_page]
  );

  /**
   * Create violation
   */
  const createViolation = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);

        const newViolation = await violationService.createViolation(studentId, data);
        setViolations((prev) => [newViolation, ...prev]);

        // Trigger callback
        if (onMutationSuccess) {
          onMutationSuccess('create', newViolation);
        }

        return { success: true, data: newViolation };
      } catch (err) {
        const errorMsg = err.message || 'Failed to create violation';
        setError(errorMsg);
        console.error('Create violation error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [studentId, onMutationSuccess]
  );

  /**
   * Update violation
   */
  const updateViolation = useCallback(
    async (violationId, data) => {
      try {
        setLoading(true);
        setError(null);

        const updatedViolation = await violationService.updateViolation(
          studentId,
          violationId,
          data
        );
        setViolations((prev) =>
          prev.map((violation) =>
            violation.id === violationId ? updatedViolation : violation
          )
        );

        // Trigger callback
        if (onMutationSuccess) {
          onMutationSuccess('update', updatedViolation);
        }

        return { success: true, data: updatedViolation };
      } catch (err) {
        const errorMsg = err.message || 'Failed to update violation';
        setError(errorMsg);
        console.error('Update violation error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [studentId, onMutationSuccess]
  );

  /**
   * Delete violation
   */
  const deleteViolation = useCallback(
    async (violationId) => {
      try {
        setLoading(true);
        setError(null);

        await violationService.deleteViolation(studentId, violationId);
        setViolations((prev) => prev.filter((violation) => violation.id !== violationId));

        // Trigger callback
        if (onMutationSuccess) {
          onMutationSuccess('delete', { id: violationId });
        }

        return { success: true };
      } catch (err) {
        const errorMsg = err.message || 'Failed to delete violation';
        setError(errorMsg);
        console.error('Delete violation error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [studentId, onMutationSuccess]
  );

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Update sorting
   */
  const updateSorting = useCallback((newSorting) => {
    setSorting((prev) => ({ ...prev, ...newSorting }));
  }, []);

  /**
   * Refetch violations
   */
  const refetch = useCallback(() => {
    fetchViolations(1);
  }, [fetchViolations]);

  return {
    violations,
    loading,
    error,
    pagination,
    filters,
    sorting,
    fetchViolations,
    createViolation,
    updateViolation,
    deleteViolation,
    updateFilters,
    updateSorting,
    refetch,
  };
};
