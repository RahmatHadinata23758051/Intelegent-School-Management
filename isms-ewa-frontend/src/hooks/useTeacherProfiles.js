import { useState, useCallback, useEffect } from 'react';
import { teacherProfileService } from '../services/teacherProfileService';

export const useTeacherProfiles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sort, setSort] = useState('created_at');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherProfileService.getTeachers({
        search,
        status: filterStatus,
        role: filterRole,
        sort,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Gagal memuat data guru');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterRole, sort]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (formData) => {
    try {
      await teacherProfileService.createTeacher(formData);
      await refetch();
    } catch (err) {
      setError(err.message || 'Gagal membuat profil guru');
      throw err;
    }
  }, [refetch]);

  const update = useCallback(async (id, formData) => {
    try {
      await teacherProfileService.updateTeacher(id, formData);
      await refetch();
    } catch (err) {
      setError(err.message || 'Gagal mengupdate profil guru');
      throw err;
    }
  }, [refetch]);

  const delete_ = useCallback(async (id) => {
    try {
      await teacherProfileService.deleteTeacher(id);
      await refetch();
    } catch (err) {
      setError(err.message || 'Gagal menghapus profil guru');
      throw err;
    }
  }, [refetch]);

  return {
    data,
    loading,
    error,
    pagination,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterRole,
    setFilterRole,
    sort,
    setSort,
    refetch,
    create,
    update,
    delete: delete_,
  };
};
