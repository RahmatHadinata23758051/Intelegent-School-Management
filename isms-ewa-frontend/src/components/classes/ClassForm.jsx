import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Class Form Component
 * Untuk create dan edit class
 */
export const ClassForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    grade_level: '',
    homeroom_teacher_id: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Populate form jika edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        grade_level: initialData.grade_level || '',
        homeroom_teacher_id: initialData.homeroom_teacher_id || '',
      });
    }
  }, [initialData]);

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Nama kelas harus diisi';
    }

    if (!formData.grade_level) {
      errors.grade_level = 'Tingkat kelas harus dipilih';
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

      {/* Class Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nama Kelas <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contoh: 10-A, XI-B, XII-C"
          className={clsx(
            'input-base',
            validationErrors.name && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.name && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.name}</p>
        )}
      </div>

      {/* Grade Level */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tingkat Kelas <span className="text-rose-600">*</span>
        </label>
        <select
          name="grade_level"
          value={formData.grade_level}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.grade_level && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        >
          <option value="">-- Pilih Tingkat Kelas --</option>
          <option value="10">Kelas 10</option>
          <option value="11">Kelas 11</option>
          <option value="12">Kelas 12</option>
        </select>
        {validationErrors.grade_level && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.grade_level}</p>
        )}
      </div>

      {/* Homeroom Teacher ID */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Guru Wali Kelas
        </label>
        <input
          type="number"
          name="homeroom_teacher_id"
          value={formData.homeroom_teacher_id}
          onChange={handleChange}
          placeholder="ID guru wali kelas (opsional)"
          className={clsx(
            'input-base',
            validationErrors.homeroom_teacher_id && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.homeroom_teacher_id && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.homeroom_teacher_id}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">Masukkan ID guru atau kosongkan jika belum ditentukan</p>
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
          {initialData ? 'Perbarui Kelas' : 'Tambah Kelas'}
        </Button>
      </div>
    </form>
  );
};
