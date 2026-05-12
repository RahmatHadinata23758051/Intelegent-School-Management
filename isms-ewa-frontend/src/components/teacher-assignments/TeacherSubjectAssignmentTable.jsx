import clsx from 'clsx';
import { ChevronRight, Edit2, Trash2, Eye } from 'lucide-react';
import { TeacherSubjectAssignmentStatusBadge } from './TeacherSubjectAssignmentStatusBadge';

/**
 * Table for displaying teacher subject assignments
 */
export const TeacherSubjectAssignmentTable = ({
  data = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  canEdit = false,
  canDelete = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="mt-4 text-sm text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-sm text-slate-600">Tidak ada data assignment guru</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Guru
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              NIP
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Kelas
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Kode Mapel
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Mata Pelajaran
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Tahun Ajaran
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((assignment) => (
            <tr key={assignment.id} className="hover:bg-slate-50 transition">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {assignment.teacher_profile?.name || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {assignment.teacher_profile?.user?.email || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {assignment.teacher_profile?.nip || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {assignment.class_subject?.school_class?.name || '-'}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {assignment.class_subject?.subject?.code || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {assignment.class_subject?.subject?.name || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {assignment.academic_year?.year || '-'}
              </td>
              <td className="px-6 py-4">
                <TeacherSubjectAssignmentStatusBadge isActive={assignment.is_active} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {canEdit && onEdit && (
                    <button
                      onClick={() => onEdit(assignment)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {canDelete && onDelete && (
                    <button
                      onClick={() => onDelete(assignment.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {!canEdit && !canDelete && (
                    <button
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                      title="Lihat"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherSubjectAssignmentTable;
