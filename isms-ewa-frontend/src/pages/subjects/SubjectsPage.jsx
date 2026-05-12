import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubjects } from '../../hooks/useSubjects';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { StatusPill } from '../../components/design-system';
import { SubjectForm } from '../../components/subjects/SubjectForm';
import { ChevronRight, Plus, Edit2, Trash2, Search, Filter, RefreshCw, BookOpen, CheckCircle2, Lightbulb } from 'lucide-react';

export const SubjectsPage = () => {
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
    sort,
    setSort,
    refetch,
    create,
    update,
    delete: deleteSubject,
  } = useSubjects();

  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Calculate summary stats
  const totalMapel = data.length;
  const mapelAktif = data.filter(s => s.is_active).length;
  const mapelNonaktif = data.filter(s => !s.is_active).length;
  const totalSKS = data.reduce((sum, s) => sum + (s.credit_hours || 0), 0);

  const handleOpenModal = (subject = null) => {
    setEditingSubject(subject);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await update(editingSubject.id, formData);
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
      await deleteSubject(id);
      setShowDeleteConfirm(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && data.length === 0) {
    return <LoadingScreen message="Memuat data mata pelajaran..." />;
  }

  return (
    <AppLayout currentPage="subjects">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mata Pelajaran</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola daftar mata pelajaran sekolah</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2} />
            Tambah Mata Pelajaran
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Mata Pelajaran</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalMapel}</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua mapel</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-100">
              <BookOpen size={20} className="text-blue-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Mata Pelajaran Aktif</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{mapelAktif}</p>
              <p className="text-xs text-slate-500 mt-0.5">Sedang berlangsung</p>
            </div>
            <div className="p-2.5 rounded-lg bg-green-100">
              <CheckCircle2 size={20} className="text-green-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-slate-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Mata Pelajaran Nonaktif</p>
              <p className="mt-2 text-2xl font-bold text-slate-500">{mapelNonaktif}</p>
              <p className="text-xs text-slate-500 mt-0.5">Tidak aktif</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100">
              <Filter size={20} className="text-slate-500" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-indigo-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total SKS</p>
              <p className="mt-2 text-2xl font-bold text-indigo-600">{totalSKS}</p>
              <p className="text-xs text-slate-500 mt-0.5">Kredit semester</p>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-100">
              <Lightbulb size={20} className="text-indigo-600" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode, nama mata pelajaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
          >
            <option value="created_at">Terbaru</option>
            <option value="code">Kode</option>
            <option value="name">Nama</option>
          </select>
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Refresh data"
          >
            <RefreshCw size={18} strokeWidth={1.5} />
          </button>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorState
            title="Gagal memuat data mata pelajaran"
            message={error}
            onRetry={refetch}
          />
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">Tidak ada data mata pelajaran</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Nama Mata Pelajaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      SKS
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
                  {data.map(subject => (
                    <tr key={subject.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-950">
                        {subject.code}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-950">
                        {subject.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {subject.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {subject.credit_hours || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusPill status={subject.is_active ? 'Aktif' : 'Nonaktif'} />
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(subject)}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(subject.id)}
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
                  Menampilkan {data.length} dari {pagination.total} mata pelajaran
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
                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
              </h2>
            </div>
            <div className="p-6">
              <SubjectForm
                subject={editingSubject}
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
              <h2 className="text-lg font-semibold text-slate-950">Hapus Mata Pelajaran?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Apakah Anda yakin ingin menghapus mata pelajaran ini? Tindakan ini tidak dapat dibatalkan.
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
