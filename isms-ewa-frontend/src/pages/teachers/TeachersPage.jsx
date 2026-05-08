import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTeacherProfiles } from '../../hooks/useTeacherProfiles';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { StatusPill } from '../../components/design-system';
import { TeacherProfileForm } from '../../components/teachers/TeacherProfileForm';
import { ChevronRight, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

export const TeachersPage = () => {
  const { user } = useAuth();
  const {
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
    delete: deleteProfile,
  } = useTeacherProfiles();

  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Calculate summary stats
  const totalGuru = data.length;
  const guruAktif = data.filter(p => p.is_active).length;
  const waliKelas = data.filter(p => p.user?.role === 'homeroom_teacher').length;
  const guruNonaktif = data.filter(p => !p.is_active).length;

  const handleOpenModal = (profile = null) => {
    setEditingProfile(profile);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProfile(null);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProfile) {
        await update(editingProfile.id, formData);
      } else {
        await create(formData);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteProfile(id);
      setShowDeleteConfirm(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && data.length === 0) {
    return <LoadingScreen message="Memuat data guru..." />;
  }

  return (
    <AppLayout currentPage="teachers">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Manajemen Guru</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola profil guru dan wali kelas</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Tambah Profil Guru
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-600">Total Guru</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{totalGuru}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-600">Guru Aktif</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-600">{guruAktif}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-600">Wali Kelas</div>
          <div className="mt-2 text-3xl font-semibold text-blue-600">{waliKelas}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-600">Guru Nonaktif</div>
          <div className="mt-2 text-3xl font-semibold text-slate-400">{guruNonaktif}</div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, NIP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Semua Role</option>
          <option value="teacher">Guru</option>
          <option value="homeroom_teacher">Wali Kelas</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="created_at">Terbaru</option>
          <option value="nip">NIP</option>
          <option value="joined_date">Tanggal Bergabung</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorState
            title="Gagal memuat data guru"
            message={error}
            onRetry={refetch}
          />
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">Tidak ada data guru</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      NIP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Spesialisasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Status
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map(profile => (
                    <tr key={profile.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-950">
                        {profile.user?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {profile.user?.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {profile.user?.role === 'homeroom_teacher' ? 'Wali Kelas' : 'Guru'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {profile.nip || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {profile.specialization || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusPill status={profile.is_active ? 'Aktif' : 'Nonaktif'} />
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(profile)}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(profile.id)}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <div className="text-sm text-slate-600">
                  Menampilkan {data.length} dari {pagination.total} guru
                </div>
                <div className="flex gap-2">
                  <button className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">
                    Sebelumnya
                  </button>
                  <button className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-950">
                {editingProfile ? 'Edit Profil Guru' : 'Tambah Profil Guru'}
              </h2>
            </div>
            <div className="p-6">
              <TeacherProfileForm
                profile={editingProfile}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-950">Hapus Profil Guru?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Apakah Anda yakin ingin menghapus profil guru ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={isSubmitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-400"
              >
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};
