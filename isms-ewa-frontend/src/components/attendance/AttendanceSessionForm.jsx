import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { useClasses } from '../../hooks/useClasses';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import { useSemesters } from '../../hooks/useSemesters';

/**
 * Premium form for creating/editing attendance session
 * Anti AI slop: Clean layout, proper validation, helpful UX
 */
export const AttendanceSessionForm = ({ session = null, onSubmit, onClose, isLoading = false }) => {
  const { data: classesData } = useClasses({ per_page: 100 });
  const { data: academicYearsData } = useAcademicYears({ per_page: 100 });
  const { data: semestersData } = useSemesters({ per_page: 100 });

  const [formData, setFormData] = useState({
    school_class_id: session?.school_class_id || '',
    academic_year_id: session?.academic_year_id || '',
    semester_id: session?.semester_id || '',
    session_date: session?.session_date || new Date().toISOString().split('T')[0],
    session_type: session?.session_type || 'daily',
    notes: session?.notes || '',
  });

  const [errors, setErrors] = useState({});

  // Auto-select active academic year and semester
  useEffect(() => {
    if (!session && academicYearsData?.data) {
      const activeYear = academicYearsData.data.find((y) => y.is_active);
      if (activeYear && !formData.academic_year_id) {
        setFormData((prev) => ({ ...prev, academic_year_id: activeYear.id }));
      }
    }
  }, [academicYearsData, session, formData.academic_year_id]);

  useEffect(() => {
    if (!session && semestersData?.data) {
      const activeSemester = semestersData.data.find((s) => s.is_active);
      if (activeSemester && !formData.semester_id) {
        setFormData((prev) => ({ ...prev, semester_id: activeSemester.id }));
      }
    }
  }, [semestersData, session, formData.semester_id]);

  const activeYear = academicYearsData?.data?.find((y) => y.is_active);
  const activeSemester = semestersData?.data?.find((s) => s.is_active);

  const validate = () => {
    const newErrors = {};

    if (!formData.school_class_id) {
      newErrors.school_class_id = 'Kelas harus dipilih';
    }
    if (!formData.academic_year_id) {
      newErrors.academic_year_id = 'Tahun ajaran harus dipilih';
    }
    if (!formData.semester_id) {
      newErrors.semester_id = 'Semester harus dipilih';
    }
    if (!formData.session_date) {
      newErrors.session_date = 'Tanggal harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Warning if no active year/semester
  const showWarning = !activeYear || !activeSemester;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {session ? 'Edit Sesi Absensi' : 'Buat Sesi Absensi'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {session ? 'Perbarui informasi sesi absensi' : 'Buat sesi absensi baru untuk kelas'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Warning */}
        {showWarning && (
          <div className="mx-6 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Perhatian</p>
              <p className="text-sm text-amber-700 mt-1">
                {!activeYear && 'Tahun ajaran aktif belum diatur. '}
                {!activeSemester && 'Semester aktif belum diatur. '}
                Silakan atur di menu Tahun Ajaran/Semester terlebih dahulu.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kelas <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.school_class_id}
              onChange={(e) => handleChange('school_class_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isLoading}
            >
              <option value="">Pilih Kelas</option>
              {classesData?.data?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {errors.school_class_id && (
              <p className="text-sm text-rose-600 mt-1">{errors.school_class_id}</p>
            )}
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tahun Ajaran <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.academic_year_id}
              onChange={(e) => handleChange('academic_year_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
              disabled={isLoading || !!activeYear}
            >
              <option value="">Pilih Tahun Ajaran</option>
              {academicYearsData?.data?.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year} {year.is_active && '(Aktif)'}
                </option>
              ))}
            </select>
            {errors.academic_year_id && (
              <p className="text-sm text-rose-600 mt-1">{errors.academic_year_id}</p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Semester <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.semester_id}
              onChange={(e) => handleChange('semester_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
              disabled={isLoading || !!activeSemester}
            >
              <option value="">Pilih Semester</option>
              {semestersData?.data?.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  Semester {semester.semester_number} - {semester.academic_year?.year}{' '}
                  {semester.is_active && '(Aktif)'}
                </option>
              ))}
            </select>
            {errors.semester_id && (
              <p className="text-sm text-rose-600 mt-1">{errors.semester_id}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tanggal <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.session_date}
              onChange={(e) => handleChange('session_date', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isLoading}
            />
            {errors.session_date && (
              <p className="text-sm text-rose-600 mt-1">{errors.session_date}</p>
            )}
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Sesi</label>
            <select
              value={formData.session_type}
              onChange={(e) => handleChange('session_type', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isLoading}
            >
              <option value="daily">Harian</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Catatan tambahan (opsional)"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || showWarning}
            >
              {isLoading ? 'Menyimpan...' : session ? 'Perbarui' : 'Buat Sesi'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
