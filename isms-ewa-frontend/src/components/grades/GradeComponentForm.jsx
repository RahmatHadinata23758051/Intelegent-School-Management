import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Grade Component Form Modal
 * Form untuk create/edit komponen nilai
 */
export const GradeComponentForm = ({ 
  component = null, 
  onSubmit, 
  onClose, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    default_weight: '',
    is_active: true,
    sort_order: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (component) {
      setFormData({
        code: component.code || '',
        name: component.name || '',
        description: component.description || '',
        default_weight: component.default_weight || '',
        is_active: component.is_active !== undefined ? component.is_active : true,
        sort_order: component.sort_order || 0,
      });
    }
  }, [component]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Kode wajib diisi';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (formData.default_weight !== '' && formData.default_weight !== null) {
      const weight = parseFloat(formData.default_weight);
      if (isNaN(weight) || weight < 0 || weight > 100) {
        newErrors.default_weight = 'Bobot harus antara 0-100';
      }
    }

    if (formData.sort_order !== '' && formData.sort_order !== null) {
      const order = parseInt(formData.sort_order);
      if (isNaN(order) || order < 0) {
        newErrors.sort_order = 'Urutan harus minimal 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header with gradient accent */}
        <div className="relative flex items-center justify-between p-6 border-b border-slate-200">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-t-2xl" />
          <h2 className="text-xl font-bold text-slate-900">
            {component ? 'Edit Komponen Nilai' : 'Tambah Komponen Nilai'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-600 hover:text-slate-900 hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Kode <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="Contoh: TUGAS, QUIZ, UTS"
              disabled={!!component}
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2',
                {
                  'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20': !errors.code,
                  'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20': errors.code,
                  'bg-slate-50 text-slate-500 cursor-not-allowed': !!component,
                }
              )}
            />
            {errors.code && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.code}</p>
            )}
            {component && (
              <p className="mt-1.5 text-xs text-slate-500">
                Kode tidak dapat diubah setelah dibuat
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Contoh: Tugas Harian"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2',
                {
                  'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20': !errors.name,
                  'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20': errors.name,
                }
              )}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Deskripsi komponen nilai (opsional)"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          {/* Default Weight */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Bobot Default (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.default_weight}
              onChange={(e) => handleChange('default_weight', e.target.value)}
              placeholder="0-100"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2',
                {
                  'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20': !errors.default_weight,
                  'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20': errors.default_weight,
                }
              )}
            />
            {errors.default_weight && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.default_weight}</p>
            )}
            <p className="mt-1.5 text-xs text-slate-500">
              Bobot default untuk komponen ini (opsional)
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Urutan Tampilan
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', e.target.value)}
              placeholder="0"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2',
                {
                  'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20': !errors.sort_order,
                  'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20': errors.sort_order,
                }
              )}
            />
            {errors.sort_order && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.sort_order}</p>
            )}
            <p className="mt-1.5 text-xs text-slate-500">
              Urutan tampilan komponen (semakin kecil semakin awal)
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Aktif
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                component ? 'Perbarui' : 'Simpan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
