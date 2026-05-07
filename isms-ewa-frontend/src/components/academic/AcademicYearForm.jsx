import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Academic Year Form Component
 * Untuk create dan edit academic year
 */
export const AcademicYearForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    year: '',
    start_date: '',
    end_date: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Populate form jika edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        year: initialData.year || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
      });
    }
  }, [initialData]);

  /**
   * Validate year format (YYYY/YYYY)
   */
  const validateYearFormat = (year) => {
    const yearRegex = /^\d{4}\/\d{4}$/;
    return yearRegex.test(year);
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.year.trim()) {
      errors.year = 'Tahun ajaran harus diisi';
    } else if (!validateYearFormat(formData.year)) {
      errors.year = 'Format harus YYYY/YYYY (contoh: 2024/2025)';
    }

    if (!formData.start_date) {
      errors.start_date = 'Tanggal mulai harus diisi';
    }

    if (!formData.end_date) {
      errors.end_date = 'Tanggal akhir harus diisi';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate <= startDate) {
        errors.end_date = 'Tanggal akhir harus setelah tanggal mulai';
      }
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

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tahun Ajaran <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Contoh: 2024/2025"
          className={clsx(
            'input-base',
            validationErrors.year && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.year && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.year}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">Format: YYYY/YYYY (contoh: 2024/2025)</p>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tanggal Mulai <span className="text-rose-600">*</span>
        </label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.start_date && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.start_date && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.start_date}</p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tanggal Akhir <span className="text-rose-600">*</span>
        </label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.end_date && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.end_date && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.end_date}</p>
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
          {initialData ? 'Perbarui Tahun Ajaran' : 'Tambah Tahun Ajaran'}
        </Button>
      </div>
    </form>
  );
};
