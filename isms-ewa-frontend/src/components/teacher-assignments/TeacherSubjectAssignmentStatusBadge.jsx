import clsx from 'clsx';

/**
 * Status badge for teacher subject assignments
 */
export const TeacherSubjectAssignmentStatusBadge = ({ isActive }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        isActive
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-slate-100 text-slate-600'
      )}
    >
      {isActive ? 'Aktif' : 'Nonaktif'}
    </span>
  );
};

export default TeacherSubjectAssignmentStatusBadge;
