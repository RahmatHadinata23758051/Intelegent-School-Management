import { useState, useCallback, useEffect } from 'react';
import classSubjectService from '../services/classSubjectService';

export const useClassSubjects = () => {
  const [classSubjects, setClassSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  });

  /**
   * Fetch class subjects with filters and pagination
   */
  const fetchClassSubjects = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.getClassSubjects({
        per_page: pagination.per_page,
        ...params,
      });
      setClassSubjects(response.data);
      setPagination(response.pagination);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch class subjects';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.per_page]);

  /**
   * Fetch subjects for a specific class
   */
  const fetchSubjectsByClass = useCallback(async (classId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.getSubjectsByClass(classId, params);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch subjects';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch classes for a specific subject
   */
  const fetchClassesBySubject = useCallback(async (subjectId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.getClassesBySubject(subjectId, params);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch classes';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new class subject assignment
   */
  const createClassSubject = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.createClassSubject(data);
      // Refresh the list
      await fetchClassSubjects();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create assignment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClassSubjects]);

  /**
   * Update a class subject assignment
   */
  const updateClassSubject = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.updateClassSubject(id, data);
      // Refresh the list
      await fetchClassSubjects();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update assignment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClassSubjects]);

  /**
   * Delete a class subject assignment
   */
  const deleteClassSubject = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.deleteClassSubject(id);
      // Refresh the list
      await fetchClassSubjects();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete assignment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClassSubjects]);

  /**
   * Assign a subject to a class (shortcut)
   */
  const assignSubjectToClass = useCallback(async (classId, subjectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.assignSubjectToClass(classId, subjectId);
      // Refresh the list
      await fetchClassSubjects();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to assign subject';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClassSubjects]);

  /**
   * Remove a subject from a class (shortcut)
   */
  const removeSubjectFromClass = useCallback(async (classId, subjectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classSubjectService.removeSubjectFromClass(classId, subjectId);
      // Refresh the list
      await fetchClassSubjects();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to remove subject';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClassSubjects]);

  /**
   * Update pagination
   */
  const setPaginationParams = useCallback((newPagination) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  }, []);

  return {
    classSubjects,
    loading,
    error,
    pagination,
    fetchClassSubjects,
    fetchSubjectsByClass,
    fetchClassesBySubject,
    createClassSubject,
    updateClassSubject,
    deleteClassSubject,
    assignSubjectToClass,
    removeSubjectFromClass,
    setPaginationParams,
  };
};

export default useClassSubjects;
