import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { Alert } from '../../components/common/Alert';
import { AttendanceStatusSelector } from '../../components/attendance/AttendanceStatusSelector';
import { AttendanceRateCard } from '../../components/attendance/AttendanceRateCard';
import attendanceSessionService from '../../services/attendanceSessionService';
import attendanceService from '../../services/attendanceService';
import { useAuth } from '../../hooks/useAuth';
import { studentService } from '../../services/studentService';

/**
 * Attendance Input Page - Premium bulk input interface
 * Anti AI slop: Fast input, clear progress, professional design
 */
export const AttendanceInputPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Load session and students
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load session
        const sessionResponse = await attendanceSessionService.getAttendanceSession(id);
        setSession(sessionResponse.data);

        // Load students for this class
        const studentsResponse = await studentService.getStudents({
          school_class_id: sessionResponse.data.school_class_id,
          per_page: 100,
        });
        // studentService already returns response.data.data, so studentsResponse is the data array
        setStudents(studentsResponse.data || []);

        // Load existing attendances
        const attendancesResponse = await attendanceService.getAttendances({
          attendance_session_id: id,
          per_page: 100,
        });

        // Map attendances by student_id
        // Response format: { success, message, data: { data: [...], meta: {...} } }
        const attendanceMap = {};
        const attendanceData = attendancesResponse.data || {};
        const attendanceList = attendanceData.data || [];
        attendanceList.forEach((att) => {
          attendanceMap[att.student_id] = {
            id: att.id,
            status: att.status,
            notes: att.notes || '',
          };
        });
        setAttendances(attendanceMap);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Calculate progress
  const totalStudents = students.length;
  const filledCount = Object.keys(attendances).length;
  const attendanceRate =
    totalStudents > 0
      ? ((Object.values(attendances).filter((a) => ['present', 'late', 'permitted'].includes(a.status))
          .length /
          totalStudents) *
        100).toFixed(1)
      : 0;

  const handleStatusChange = (studentId, status) => {
    setAttendances((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
    setHasChanges(true);
  };

  const handleSetAllPresent = () => {
    const newAttendances = {};
    students.forEach((student) => {
      newAttendances[student.id] = {
        ...attendances[student.id],
        status: 'present',
      };
    });
    setAttendances(newAttendances);
    setHasChanges(true);
  };

  const handleSetEmptyPresent = () => {
    const newAttendances = { ...attendances };
    students.forEach((student) => {
      if (!newAttendances[student.id]) {
        newAttendances[student.id] = { status: 'present' };
      }
    });
    setAttendances(newAttendances);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare bulk data
      const bulkData = students.map((student) => ({
        student_id: student.id,
        status: attendances[student.id]?.status || 'absent',
        notes: attendances[student.id]?.notes || '',
      }));

      await attendanceService.bulkStoreAttendances(id, bulkData);
      
      setSuccessMessage('Absensi berhasil disimpan');
      setHasChanges(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan absensi');
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!window.confirm('Kunci sesi absensi? Setelah dikunci tidak dapat diubah lagi.')) return;
    
    try {
      setSaving(true);
      await attendanceSessionService.lockAttendanceSession(id);
      setSuccessMessage('Sesi absensi berhasil dikunci');
      
      // Reload session
      const sessionResponse = await attendanceSessionService.getAttendanceSession(id);
      setSession(sessionResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mengunci sesi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Memuat data absensi..." />;
  }

  if (error && !session) {
    return (
      <AppLayout currentPage="attendance-sessions">
        <ErrorState title="Gagal memuat data" message={error} onRetry={() => window.location.reload()} />
      </AppLayout>
    );
  }

  const isLocked = session?.is_locked;

  return (
    <AppLayout currentPage="attendance-sessions">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6">
          <Alert type="success" title="Berhasil" message={successMessage} onClose={() => setSuccessMessage('')} />
        </div>
      )}
      {error && (
        <div className="mb-6">
          <Alert type="error" title="Error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/attendance/sessions')}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} />
          Kembali ke Sesi Absensi
        </button>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Input Absensi</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
              <span className="font-medium">{session?.school_class?.name}</span>
              <span>•</span>
              <span>
                {new Date(session?.session_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span>{session?.academic_year?.year}</span>
              <span>•</span>
              <span>Semester {session?.semester?.semester_number}</span>
            </div>
          </div>

          {isLocked && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
              <Lock size={18} />
              Sesi Terkunci
            </span>
          )}
        </div>
      </div>

      {/* Progress Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-slate-600 mb-2">Total Siswa</p>
          <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-slate-600 mb-2">Sudah Diisi</p>
          <p className="text-3xl font-bold text-blue-600">
            {filledCount} <span className="text-lg text-slate-500">/ {totalStudents}</span>
          </p>
        </Card>
        <AttendanceRateCard rate={attendanceRate} label="Tingkat Kehadiran" />
      </div>

      {/* Locked Warning */}
      {isLocked && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Sesi Terkunci</p>
            <p className="text-sm text-amber-700 mt-1">
              Sesi absensi ini sudah dikunci dan tidak dapat diubah.
            </p>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {!isLocked && (
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSetAllPresent}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              disabled={saving}
            >
              Set Semua Hadir
            </button>
            <button
              onClick={handleSetEmptyPresent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              disabled={saving}
            >
              Set Kosong Sebagai Hadir
            </button>
            {hasChanges && (
              <span className="text-sm text-amber-600 font-medium">• Perubahan belum disimpan</span>
            )}
          </div>
        </Card>
      )}

      {/* Students List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  NIS
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status Kehadiran
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.student_id}</td>
                  <td className="px-6 py-4">
                    <AttendanceStatusSelector
                      value={attendances[student.id]?.status || 'absent'}
                      onChange={(status) => handleStatusChange(student.id, status)}
                      disabled={isLocked}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actions */}
      {!isLocked && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => navigate('/attendance/sessions')}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            disabled={saving}
          >
            Kembali
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            disabled={saving || !hasChanges}
          >
            <Save size={18} />
            {saving ? 'Menyimpan...' : 'Simpan Absensi'}
          </button>
          {isAdmin && filledCount === totalStudents && (
            <button
              onClick={handleLock}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              disabled={saving}
            >
              <Lock size={18} />
              Kunci Sesi
            </button>
          )}
        </div>
      )}
    </AppLayout>
  );
};
