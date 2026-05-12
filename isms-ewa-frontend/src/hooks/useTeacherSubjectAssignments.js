import { useState, useCallback, useEffect } from 'react';
import { teacherSubjectAssignmentService } from '../services/teacherSubjectAssignmentService';

export const useTeacherSubjectAssignments = (initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // Filter and search state
  const [filters, setFilters] = useState({
    search: '',
    filterTeacher: null,
    filterClass: null,
    filterSubject: null,
    filterClassSubject: null,
    filterAcademicYear: null,
    filterStatus: null,
    sort: 'created_at',
    sortOrder: 'desc',
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  /**
   * Fetch assignments from API
   */
  const fetchAssignments = useCallback(async (params = filters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: params.page || 1,
        per_page: params.per_page || 10,
        sort: params.sort || 'created_at',
        sort_order: params.sortOrder || 'desc',
      };

      // Add search
      if (params.search) {
        queryParams.search = params.search;
      }

      // Add filters
      if (params.filterTeacher) {
        queryParams.teacher_profile_id = params.filterTeacher;
      }
      if (params.filterAcademicYear) {
        queryParams.academic_year_id = params.filterAcademicYear;
      }
      if (params.filterStatus !== null && params.filterStatus !== undefined) {
        queryParams.is_active = params.filterStatus;
      }

      const response = await teacherSubjectAssignmentService.getTeacherSubjectAssignments(queryParams);

      setData(response.data.data || []);
      setPagination({
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || 10,
        total: response.data.total || 0,
        last_page: response.data.last_page || 1,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch assignments';
      setError(errorMessage);
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchAssignments(updatedFilters);
  }, [filters, fetchAssignments]);

  /**
   * Change page
   */
  const changePage = useCallback((page) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchAssignments(updatedFilters);
  }, [filters, fetchAssignments]);

  /**
   * Search assignments
   */
  const search = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  /**
   * Filter by teacher
   */
  const filterByTeacher = useCallback((teacherId) => {
    updateFilters({ filterTeacher: teacherId });
  }, [updateFilters]);

  /**
   * Filter by academic year
   */
  const filterByAcademicYear = useCallback((yearId) => {
    updateFilters({ filterAcademicYear: yearId });
  }, [updateFilters]);

  /**
   * Filter by status
   */
  const filterByStatus = useCallback((status) => {
    updateFilters({ filterStatus: status });
  }, [updateFilters]);

  /**
   * Sort assignments
   */
  const sort = useCallback((sortField, sortOrder = 'asc') => {
    updateFilters({ sort: sortField, sortOrder });
  }, [updateFilters]);

  /**
   * Create new assignment
   */
  const create = useCallback(async (assignmentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teacherSubjectAssignmentService.createTeacherSubjectAssignment(assignmentData);
      
      // Refresh list
      await fetchAssignments(filters);
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create assignment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [filters, fetchAssignments]);

  /**
   * Update assignment
   */
  const update = useCallback(async (id, assignmentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teacherSubjectAssignmentService.updateTeacherSubjectAssignment(id, assignmentData);
      
      // Refresh list
      await fetchAssignments(filters);
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update assignment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [filters, fetchAssignments]);

  /**
   * Delete/remove assignment
   */
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await teacherSubjectAssignmentService.deleteTeacherSubjectAssignment(id);
      
      // Refresh list
      await fetchAssignments(filters);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete assignment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [filters, fetchAssignments]);

  /**
   * Refetch data
   */
  const refetch = useCallback(() => {
    fetchAssignments(filters);
  }, [filters, fetchAssignments]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchAssignments(filters);
  }, []);

  return {
    // Data
    data,
    loading,
    error,
    pagination,

    // Filters and search
    filters,
    updateFilters,
    search,
    filterByTeacher,
    filterByAcademicYear,
    filterByStatus,
    sort,

    // Pagination
    changePage,

    // CRUD
    create,
    update,
    remove,

    // Utilities
    refetch,
  };
};

export default useTeacherSubjectAssignments;
