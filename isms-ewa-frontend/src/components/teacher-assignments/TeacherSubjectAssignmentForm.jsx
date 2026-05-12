import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle, Loader } from 'lucide-react';
import { teacherProfileService } from '../../services/teacherProfileService';
import { classSubjectService } from '../../services/classSubjectService';
import { academicYearService } from '../../services/academicYearService';

/**
 * Form for creating/editing teacher subject assignments
 */
export const TeacherSubjectAssignmentForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    teacher_profile_id: initialData?.teacher_profile_id || '',
    class_subject_id: initialData?.class_subject_id || '',
    academic_year_id: initialData?.academic_year_id || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  });

  const [formError, setFormError] = useState(error);
  const [teachers, setTeachers] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        // Fetch active teachers
        const teachersRes = await teacherProfileService.getTeachers({
          is_active: true,
          per_page: 100,
        });
        setTeachers(teachersRes.data || []);

        // Fetch active class subjects
        const classSubjectsRes = await classSubjectService.getClassSubjects({
          is_active: true,
          per_page: 100,
        });
        setClassSubjects(classSubjectsRes.data || []);

        // Fetch academic years
        const yearsRes = await academicYearService.getAcademicYears({
          per_page: 100,
        });
        setAcademicYears(yearsRes.data || []);
      } catch (err) {
        console.error('Error fetching form options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Update form error when prop changes
  useEffect(() => {
    setFormError(error);
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.teacher_profile_id) {
      setFormError('Guru harus dipilih');
      return;
    }
    if (!formData.class_subject_id) {
      setFormError('Mata Pelajaran Kelas harus dipilih');
      return;
    }
    if (!formData.academic_year_id) {
      setFormError('Tahun Ajaran harus dipilih');
      return;
    }

    onSubmit(formData);
  };

  // Get class subject label with class and subject info
  const getClassSubjectLabel = (classSubject) => {
    if (!classSubject) return '';
    const className = classSubject.school_class?.name || 'Kelas';
    const subjectCode = classSubject.subject?.code || '';
    const subjectName = classSubject.subject?.name || '';
    return `${className} — ${subjectCode} ${subjectName}`;
  };

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {formError && (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-900">Terjadi Kesalahan</p>
            <p className="mt-1 text-sm text-red-700">{formError}</p>
          </div>
        </div>
      )}

      {/* Teacher Profile Dropdown */}
      <div>
        <label htmlFor="teacher_profile_id" className="block text-sm font-semibold text-slate-700 mb-2">
          Guru <span className="text-red-600">*</span>
        </label>
        <select
          id="teacher_profile_id"
          name="teacher_profile_id"
          value={formData.teacher_profile_id}
          onChange={handleChange}
          className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={loading}
        >
          <option value="">-- Pilih Guru --</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} ({teacher.nip || 'N/A'})
            </option>
          ))}
        </select>
      </div>

      {/* Class Subject Dropdown */}
      <div>
        <label htmlFor="class_subject_id" className="block text-sm font-semibold text-slate-700 mb-2">
          Mata Pelajaran Kelas <span className="text-red-600">*</span>
        </label>
        <select
          id="class_subject_id"
          name="class_subject_id"
          value={formData.class_subject_id}
          onChange={handleChange}
          className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={loading}
        >
          <option value="">-- Pilih Mata Pelajaran Kelas --</option>
          {classSubjects.map((cs) => (
            <option key={cs.id} value={cs.id}>
              {getClassSubjectLabel(cs)}
            </option>
          ))}
        </select>
      </div>

      {/* Academic Year Dropdown */}
      <div>
        <label htmlFor="academic_year_id" className="block text-sm font-semibold text-slate-700 mb-2">
          Tahun Ajaran <span className="text-red-600">*</span>
        </label>
        <select
          id="academic_year_id"
          name="academic_year_id"
          value={formData.academic_year_id}
          onChange={handleChange}
          className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={loading}
        >
          <option value="">-- Pilih Tahun Ajaran --</option>
          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year} {year.is_active ? '(Aktif)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Active Checkbox */}
      <div className="flex items-center gap-3">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          disabled={loading}
        />
        <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
          Aktif
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            'flex-1 h-10 rounded-lg font-semibold text-white transition',
            loading
              ? 'cursor-not-allowed bg-blue-400'
              : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 h-10 rounded-lg border border-slate-300 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export default TeacherSubjectAssignmentForm;
