import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Violation Form Component
 * Untuk create dan edit violation
 */
export const ViolationForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    severity: '',
    reported_date: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Severity options dengan penjelasan
  const severityOptions = [
    { value: 'minor', label: 'Ringan', description: 'Pelanggaran kecil' },
    { value: 'moderate', label: 'Sedang', description: 'Pelanggaran sedang' },
    { value: 'major', label: 'Berat', description: 'Pelanggaran berat' },
    { value: 'severe', label: 'Sangat Berat', description: 'Pelanggaran sangat berat' },
  ];

  // Populate form jika edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        severity: initialData.severity || '',
        reported_date: initialData.reported_date || '',
      });
    }
  }, [initialData]);

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.description.trim()) {
      errors.description = 'Deskripsi pelanggaran harus diisi';
    }

    if (!formData.severity) {
      errors.severity = 'Tingkat keparahan harus dipilih';
    }

    if (!formData.reported_date) {
      errors.reported_date = 'Tanggal pelaporan harus diisi';
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

  const selectedSeverity = severityOptions.find((opt) => opt.value === formData.severity);
  const isMajorOrSevere = formData.severity === 'major' || formData.severity === 'severe';

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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Deskripsi Pelanggaran <span className="text-rose-600">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Jelaskan detail pelanggaran yang terjadi..."
          rows="4"
          className={clsx(
            'input-base resize-none',
            validationErrors.description && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.description && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.description}</p>
        )}
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tingkat Keparahan <span className="text-rose-600">*</span>
        </label>
        <div className="space-y-2">
          {severityOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                formData.severity === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <input
                type="radio"
                name="severity"
                value={option.value}
                checked={formData.severity === option.value}
                onChange={handleChange}
                disabled={loading}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{option.label}</p>
                <p className="text-xs text-slate-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
        {validationErrors.severity && (
          <p className="text-xs text-rose-600 mt-2">{validationErrors.severity}</p>
        )}
      </div>

      {/* Warning untuk major/severe */}
      {isMajorOrSevere && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Peringatan</p>
            <p className="text-sm text-amber-700 mt-1">
              Pelanggaran dengan tingkat keparahan {selectedSeverity?.label.toLowerCase()} akan
              mempengaruhi skor risiko siswa secara signifikan.
            </p>
          </div>
        </div>
      )}

      {/* Reported Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tanggal Pelaporan <span className="text-rose-600">*</span>
        </label>
        <input
          type="date"
          name="reported_date"
          value={formData.reported_date}
          onChange={handleChange}
          className={clsx(
            'input-base',
            validationErrors.reported_date && 'border-rose-500 focus:ring-rose-500'
          )}
          disabled={loading}
        />
        {validationErrors.reported_date && (
          <p className="text-xs text-rose-600 mt-1">{validationErrors.reported_date}</p>
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
          {initialData ? 'Perbarui Pelanggaran' : 'Tambah Pelanggaran'}
        </Button>
      </div>
    </form>
  );
};
