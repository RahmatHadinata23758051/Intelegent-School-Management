import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Student Form Component
 * Untuk create dan edit student
 */
export const StudentForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
  classes = [],
}) => {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    gender: '',
    birth_date: '',
    address: '',
    school_class_id: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Populate form jika edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        student_id: initialData.student_id || '',
        name: initialData.name || '',
        email: initialData.email || '',
        gender: initialData.gender || '',
        birth_date: initialData.birth_date || '',
        address: initialData.address || '',
        school_class_id: initialData.school_class_id || '',
      });
    }
  }, [initialData]);

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.student_id.trim()) {
      errors.student_id = 'Student ID harus diisi';
    }

    if (!formData.name.trim()) {
      errors.name = 'Nama siswa harus diisi';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email harus diisi';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Format email tidak valid';
      }
    }

    if (!formData.gender) {
      errors.gender = 'Jenis kelamin harus dipilih';
    }

    if (!formData.birth_date) {
      errors.birth_date = 'Tanggal lahir harus diisi';
    }

    if (!formData.school_class_id) {
      errors.school_class_id = 'Kelas harus dipilih';
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

      {/* Student ID */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Student ID <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          placeholder="Contoh: STU001, STU002"
          className={clsx(
            'input-base',
            validationErrors.student_id && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading || !!initialData}
        />
        {validationErrors.student_id && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.student_id}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nama Siswa <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap siswa"
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

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email <span className="text-rose-600">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Contoh: siswa@sekolah.com"
          className={clsx(
            'input-base',
            validationErrors.email && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.email && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.email}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Jenis Kelamin <span className="text-rose-600">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.gender && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        >
          <option value="">-- Pilih Jenis Kelamin --</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
        {validationErrors.gender && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.gender}</p>
        )}
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tanggal Lahir <span className="text-rose-600">*</span>
        </label>
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.birth_date && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.birth_date && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.birth_date}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Alamat
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Masukkan alamat lengkap siswa"
          rows="3"
          className={clsx(
            'input-base resize-none',
            validationErrors.address && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.address && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.address}</p>
        )}
      </div>

      {/* School Class */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kelas <span className="text-rose-600">*</span>
        </label>
        <select
          name="school_class_id"
          value={formData.school_class_id}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.school_class_id && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        >
          <option value="">-- Pilih Kelas --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.grade_level})
            </option>
          ))}
        </select>
        {validationErrors.school_class_id && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.school_class_id}</p>
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
          {initialData ? 'Perbarui Siswa' : 'Tambah Siswa'}
        </Button>
      </div>
    </form>
  );
};
