import { useEffect, useState } from 'react';
import { teacherProfileService } from '../../services/teacherProfileService';

export const TeacherProfileForm = ({ profile, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    nip: '',
    qualification: '',
    specialization: '',
    phone: '',
    address: '',
    employment_status: 'permanent',
    joined_date: '',
    is_active: true,
  });

  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [errors, setErrors] = useState({});

  // Load candidates on mount
  useEffect(() => {
    const loadCandidates = async () => {
      setLoadingCandidates(true);
      try {
        const response = await teacherProfileService.getTeacherCandidates();
        setCandidates(response.data || []);
      } catch (err) {
        console.error('Failed to load candidates:', err);
      } finally {
        setLoadingCandidates(false);
      }
    };

    loadCandidates();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (profile) {
      setFormData({
        user_id: profile.user?.id || '',
        nip: profile.nip || '',
        qualification: profile.qualification || '',
        specialization: profile.specialization || '',
        phone: profile.phone || '',
        address: profile.address || '',
        employment_status: profile.employment_status || 'permanent',
        joined_date: profile.joined_date || '',
        is_active: profile.is_active !== undefined ? profile.is_active : true,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.message || 'Terjadi kesalahan' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {errors.general}
        </div>
      )}

      {/* User Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          User <span className="text-red-600">*</span>
        </label>
        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          disabled={profile || loadingCandidates}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
        >
          <option value="">Pilih User...</option>
          {candidates.map(candidate => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name} ({candidate.email})
            </option>
          ))}
        </select>
        {errors.user_id && (
          <p className="mt-1 text-sm text-red-600">{errors.user_id[0]}</p>
        )}
      </div>

      {/* NIP */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          NIP
        </label>
        <input
          type="text"
          name="nip"
          value={formData.nip}
          onChange={handleChange}
          placeholder="Nomor Induk Pegawai"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.nip && (
          <p className="mt-1 text-sm text-red-600">{errors.nip[0]}</p>
        )}
      </div>

      {/* Qualification */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Kualifikasi
        </label>
        <input
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Contoh: S1 Pendidikan Matematika"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.qualification && (
          <p className="mt-1 text-sm text-red-600">{errors.qualification[0]}</p>
        )}
      </div>

      {/* Specialization */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Spesialisasi
        </label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Contoh: Matematika"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.specialization && (
          <p className="mt-1 text-sm text-red-600">{errors.specialization[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Nomor Telepon
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Contoh: 081234567890"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Alamat
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Alamat lengkap"
          rows="3"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address[0]}</p>
        )}
      </div>

      {/* Employment Status */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Status Kepegawaian
        </label>
        <select
          name="employment_status"
          value={formData.employment_status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="permanent">Tetap</option>
          <option value="contract">Kontrak</option>
          <option value="honorary">Honorer</option>
          <option value="intern">Magang</option>
        </select>
        {errors.employment_status && (
          <p className="mt-1 text-sm text-red-600">{errors.employment_status[0]}</p>
        )}
      </div>

      {/* Joined Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Tanggal Bergabung
        </label>
        <input
          type="date"
          name="joined_date"
          value={formData.joined_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.joined_date && (
          <p className="mt-1 text-sm text-red-600">{errors.joined_date[0]}</p>
        )}
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 text-sm font-medium text-slate-700">
          Aktif
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
};
