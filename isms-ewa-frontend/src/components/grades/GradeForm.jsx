import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Grade Form Component
 * Untuk create dan edit grade
 */
export const GradeForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    score: '',
    semester: '',
    academic_year: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Populate form jika edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject || '',
        score: initialData.score || '',
        semester: initialData.semester || '',
        academic_year: initialData.academic_year || '',
      });
    }
  }, [initialData]);

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.subject.trim()) {
      errors.subject = 'Mata pelajaran harus diisi';
    }

    if (!formData.score) {
      errors.score = 'Nilai harus diisi';
    } else {
      const score = Number(formData.score);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.score = 'Nilai harus antara 0-100';
      }
    }

    if (!formData.semester) {
      errors.semester = 'Semester harus dipilih';
    }

    if (!formData.academic_year.trim()) {
      errors.academic_year = 'Tahun akademik harus diisi';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error untuk field ini
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Backend Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-900">Terjadi Kesalahan</p>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Mata Pelajaran <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Contoh: Matematika, Bahasa Indonesia"
          className={clsx(
            'input-base',
            validationErrors.subject && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.subject && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.subject}</p>
        )}
      </div>

      {/* Score */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nilai <span className="text-rose-600">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            placeholder="0-100"
            min="0"
            max="100"
            step="0.01"
            className={clsx(
              'input-base pr-12',
              validationErrors.score && 'border-rose-500 focus:ring-rose-500'
            )}
            disabled={loading}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
            /100
          </span>
        </div>
        {validationErrors.score && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.score}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">Masukkan nilai antara 0-100</p>
      </div>

      {/* Semester */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Semester <span className="text-rose-600">*</span>
        </label>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.semester && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        >
          <option value="">-- Pilih Semester --</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
        {validationErrors.semester && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.semester}</p>
        )}
      </div>

      {/* Academic Year */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tahun Akademik <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="academic_year"
          value={formData.academic_year}
          onChange={handleChange}
          placeholder="Contoh: 2023/2024"
          className={clsx(
            'input-base',
            validationErrors.academic_year && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.academic_year && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.academic_year}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          {initialData ? 'Perbarui Nilai' : 'Tambah Nilai'}
        </Button>
      </div>
    </form>
  );
};
