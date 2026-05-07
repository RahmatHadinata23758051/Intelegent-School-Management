import { useState, useCallback } from 'react';
import { gradeService } from '../services/gradeService';

/**
 * Hook untuk manage grades
 * @param {number} studentId - ID student
 * @param {function} onMutationSuccess - Callback setelah mutation sukses (untuk refresh risk score, dll)
 */
export const useGrades = (studentId, onMutationSuccess = null) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState({
    subject: '',
    semester: '',
    academic_year: '',
  });
  const [sorting, setSorting] = useState({
    sort_by: 'created_at',
    sort_direction: 'desc',
  });

  /**
   * Fetch grades
   */
  const fetchGrades = useCallback(
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

        const response = await gradeService.getGrades(studentId, params);

        // Handle paginated response
        if (response.data && Array.isArray(response.data)) {
          setGrades(response.data);
          if (response.meta) {
            setPagination(response.meta);
          }
        } else if (Array.isArray(response)) {
          setGrades(response);
        }
      } catch (err) {
        setError(err.message || 'Failed to load grades');
        console.error('Fetch grades error:', err);
      } finally {
        setLoading(false);
      }
    },
    [studentId, filters, sorting, pagination.per_page]
  );

  /**
   * Create grade
   */
  const createGrade = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);

        const newGrade = await gradeService.createGrade(studentId, data);
        setGrades((prev) => [newGrade, ...prev]);

        // Trigger callback
        if (onMutationSuccess) {
          onMutationSuccess('create', newGrade);
        }

        return { success: true, data: newGrade };
      } catch (err) {
        const errorMsg = err.message || 'Failed to create grade';
        setError(errorMsg);
        console.error('Create grade error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [studentId, onMutationSuccess]
  );

  /**
   * Update grade
   */
  const updateGrade = useCallback(
    async (gradeId, data) => {
      try {
        setLoading(true);
        setError(null);

        const updatedGrade = await gradeService.updateGrade(studentId, gradeId, data);
        setGrades((prev) =>
          prev.map((grade) => (grade.id === gradeId ? updatedGrade : grade))
        );

        // Trigger callback
        if (onMutationSuccess) {
          onMutationSuccess('update', updatedGrade);
        }

        return { success: true, data: updatedGrade };
      } catch (err) {
        const errorMsg = err.message || 'Failed to update grade';
        setError(errorMsg);
        console.error('Update grade error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [studentId, onMutationSuccess]
  );

  /**
   * Delete grade
   */
  const deleteGrade = useCallback(
    async (gradeId) => {
      try {
        setLoading(true);
        setError(null);

        await gradeService.deleteGrade(studentId, gradeId);
        setGrades((prev) => prev.filter((grade) => grade.id !== gradeId));

        // Trigger callback
        if (onMutationSuccess) {
          onMutationSuccess('delete', { id: gradeId });
        }

        return { success: true };
      } catch (err) {
        const errorMsg = err.message || 'Failed to delete grade';
        setError(errorMsg);
        console.error('Delete grade error:', err);
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
   * Refetch grades
   */
  const refetch = useCallback(() => {
    fetchGrades(1);
  }, [fetchGrades]);

  return {
    grades,
    loading,
    error,
    pagination,
    filters,
    sorting,
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    updateFilters,
    updateSorting,
    refetch,
  };
};
