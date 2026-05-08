import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';

export const ClassSubjectForm = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
  schoolClasses = [],
  subjects = [],
}) => {
  const [formData, setFormData] = useState({
    school_class_id: '',
    subject_id: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        school_class_id: initialData.school_class_id,
        subject_id: initialData.subject_id,
        is_active: initialData.is_active,
      });
    } else {
      setFormData({
        school_class_id: '',
        subject_id: '',
        is_active: true,
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!initialData && !formData.school_class_id) {
      newErrors.school_class_id = 'Kelas harus dipilih';
    }
    if (!initialData && !formData.subject_id) {
      newErrors.subject_id = 'Mata pelajaran harus dipilih';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      school_class_id: '',
      subject_id: '',
      is_active: true,
    });
    setErrors({});
    onClose();
  };

  const isEditMode = !!initialData;
  const activeSubjects = subjects.filter((s) => s.is_active);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">
            {isEditMode ? 'Edit Assignment' : 'Tambah Assignment'}
          </h3>

          {!isEditMode && (
            <>
              {/* School Class Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Kelas</label>
                <select
                  value={formData.school_class_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      school_class_id: e.target.value,
                    })
                  }
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                    errors.school_class_id
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Pilih Kelas</option>
                  {schoolClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.school_class_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.school_class_id}</p>
                )}
              </div>

              {/* Subject Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Mata Pelajaran</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject_id: e.target.value,
                    })
                  }
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                    errors.subject_id
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {activeSubjects.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.code} - {subj.name}
                    </option>
                  ))}
                </select>
                {errors.subject_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.subject_id}</p>
                )}
              </div>
            </>
          )}

          {/* Active Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Aktif
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || (!isEditMode && (!formData.school_class_id || !formData.subject_id))}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ClassSubjectForm;
