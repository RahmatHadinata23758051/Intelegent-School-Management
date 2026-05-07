import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Semester Form Component
 * Untuk create dan edit semester
 */
export const SemesterForm = ({
  initialData = null,
  academicYears = [],
  selectedAcademicYear = null,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    academic_year_id: '',
    semester_number: '',
    start_date: '',
    end_date: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Populate form jika edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        academic_year_id: initialData.academic_year_id || '',
        semester_number: initialData.semester_number || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
      });
    } else if (selectedAcademicYear) {
      // Set academic year jika ada selected
      setFormData((prev) => ({
        ...prev,
        academic_year_id: selectedAcademicYear,
      }));
    }
  }, [initialData, selectedAcademicYear]);

  /**
   * Get selected academic year data
   */
  const getSelectedAcademicYear = () => {
    return academicYears.find((ay) => ay.id === parseInt(formData.academic_year_id));
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.academic_year_id) {
      errors.academic_year_id = 'Tahun ajaran harus dipilih';
    }

    if (!formData.semester_number) {
      errors.semester_number = 'Semester harus dipilih';
    } else if (![1, 2].includes(parseInt(formData.semester_number))) {
      errors.semester_number = 'Semester harus 1 atau 2';
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

    // Validate dates are within academic year range
    if (formData.academic_year_id && formData.start_date && formData.end_date) {
      const selectedAY = getSelectedAcademicYear();
      if (selectedAY) {
        const ayStartDate = new Date(selectedAY.start_date);
        const ayEndDate = new Date(selectedAY.end_date);
        const semStartDate = new Date(formData.start_date);
        const semEndDate = new Date(formData.end_date);

        if (semStartDate < ayStartDate) {
          errors.start_date = 'Tanggal mulai harus dalam range tahun ajaran';
        }

        if (semEndDate > ayEndDate) {
          errors.end_date = 'Tanggal akhir harus dalam range tahun ajaran';
        }
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

    await onSubmit({
      ...formData,
      academic_year_id: parseInt(formData.academic_year_id),
      semester_number: parseInt(formData.semester_number),
    });
  };

  const selectedAY = getSelectedAcademicYear();

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

      {/* Academic Year */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tahun Ajaran <span className="text-rose-600">*</span>
        </label>
        <select
          name="academic_year_id"
          value={formData.academic_year_id}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.academic_year_id && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        >
          <option value="">-- Pilih Tahun Ajaran --</option>
          {academicYears.map((ay) => (
            <option key={ay.id} value={ay.id}>
              {ay.year}
            </option>
          ))}
        </select>
        {validationErrors.academic_year_id && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.academic_year_id}</p>
        )}
      </div>

      {/* Semester Number */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Semester <span className="text-rose-600">*</span>
        </label>
        <div className="flex gap-3">
          {[1, 2].map((num) => (
            <label key={num} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="semester_number"
                value={num}
                checked={parseInt(formData.semester_number) === num}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">Semester {num}</span>
            </label>
          ))}
        </div>
        {validationErrors.semester_number && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.semester_number}</p>
        )}
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
          min={selectedAY?.start_date}
          max={selectedAY?.end_date}
        />
        {validationErrors.start_date && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.start_date}</p>
        )}
        {selectedAY && (
          <p className="text-xs text-slate-500 mt-1">
            Range: {new Date(selectedAY.start_date).toLocaleDateString('id-ID')} -{' '}
            {new Date(selectedAY.end_date).toLocaleDateString('id-ID')}
          </p>
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
          min={selectedAY?.start_date}
          max={selectedAY?.end_date}
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
          {initialData ? 'Perbarui Semester' : 'Tambah Semester'}
        </Button>
      </div>
    </form>
  );
};
