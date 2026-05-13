import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { Alert } from '../../components/common/Alert';
import { WeeklyGradeScoreInput } from '../../components/grades/WeeklyGradeScoreInput';
import { ScoreBadge } from '../../components/grades/ScoreBadge';
import weeklyGradeService from '../../services/weeklyGradeService';
import teacherSubjectAssignmentService from '../../services/teacherSubjectAssignmentService';
import gradeComponentService from '../../services/gradeComponentService';
import { academicYearService } from '../../services/academicYearService';
import { semesterService } from '../../services/semesterService';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

/**
 * Weekly Grade Input Page - Premium bulk input interface
 * Main page for teachers to input weekly grades for multiple students
 */
export const WeeklyGradeInputPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assignments, setAssignments] = useState([]);
  const [gradeComponents, setGradeComponents] = useState([]);
  const [academicYear, setAcademicYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher' || user?.role === 'homeroom_teacher';

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load assignments
        const assignmentsResponse = await teacherSubjectAssignmentService.getTeacherSubjectAssignments({
          per_page: 100,
        });
        setAssignments(assignmentsResponse.data?.data || []);

        // Load grade components
        const componentsResponse = await gradeComponentService.getActiveGradeComponents();
        setGradeComponents(componentsResponse.data || []);

        // Load active academic year
        const yearResponse = await academicYearService.getActiveAcademicYear();
        setAcademicYear(yearResponse);

        // Load active semester
        const semesterResponse = await semesterService.getActiveSemester();
        setSemester(semesterResponse);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load students when assignment is selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedAssignment) {
        setStudents([]);
        setGrades({});
        return;
      }

      try {
        setLoadingStudents(true);
        setError(null);

        // Find selected assignment
        const assignment = assignments.find((a) => a.id === parseInt(selectedAssignment));
        if (!assignment) return;

        // Load students for this class
        const studentsResponse = await studentService.getStudents({
          school_class_id: assignment.class_subject?.school_class_id,
          per_page: 100,
        });
        setStudents(studentsResponse.data || []);

        // Load existing grades if week and component are selected
        if (weekNumber && selectedComponent && academicYear && semester) {
          const gradesResponse = await weeklyGradeService.getWeeklyGrades({
            teacher_subject_assignment_id: selectedAssignment,
            grade_component_id: selectedComponent,
            academic_year_id: academicYear.id,
            semester_id: semester.id,
            week_number: weekNumber,
            per_page: 100,
          });

          // Map grades by student_id
          const gradeMap = {};
          const gradeList = gradesResponse.data?.data || [];
          gradeList.forEach((grade) => {
            gradeMap[grade.student_id] = {
              id: grade.id,
              score: grade.score,
              notes: grade.notes || '',
            };
          });
          setGrades(gradeMap);
        } else {
          setGrades({});
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Gagal memuat siswa');
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedAssignment, weekNumber, selectedComponent, academicYear, semester, assignments]);

  // Calculate progress
  const totalStudents = students.length;
  const filledCount = Object.values(grades).filter((g) => g.score !== '' && g.score !== null).length;
  const averageScore =
    filledCount > 0
      ? (Object.values(grades).reduce((sum, g) => sum + (parseFloat(g.score) || 0), 0) / filledCount).toFixed(1)
      : 0;
  const lowScoreCount = Object.values(grades).filter((g) => parseFloat(g.score) < 70).length;

  const handleScoreChange = (studentId, score) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score,
      },
    }));
    setHasChanges(true);
  };

  const handleNotesChange = (studentId, notes) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
    setHasChanges(true);
  };

  const handleSetAllDefault = () => {
    const newGrades = {};
    students.forEach((student) => {
      newGrades[student.id] = {
        ...grades[student.id],
        score: 75,
      };
    });
    setGrades(newGrades);
    setHasChanges(true);
  };

  const handleClearChanges = () => {
    setGrades({});
    setHasChanges(false);
  };

  const handleSave = async () => {
    if (!selectedAssignment || !selectedComponent || !weekNumber || !academicYear || !semester) {
      setError('Mohon lengkapi semua pilihan sebelum menyimpan');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare bulk data
      const bulkData = {
        teacher_subject_assignment_id: parseInt(selectedAssignment),
        grade_component_id: parseInt(selectedComponent),
        academic_year_id: academicYear.id,
        semester_id: semester.id,
        week_number: parseInt(weekNumber),
        assessment_date: assessmentDate,
        grades: students
          .filter((student) => grades[student.id]?.score !== '' && grades[student.id]?.score !== null)
          .map((student) => ({
            student_id: student.id,
            score: parseFloat(grades[student.id].score),
            notes: grades[student.id].notes || '',
          })),
      };

      if (bulkData.grades.length === 0) {
        setError('Tidak ada nilai yang diisi');
        setSaving(false);
        return;
      }

      await weeklyGradeService.bulkStoreWeeklyGrades(bulkData);
      
      setSuccessMessage(`Berhasil menyimpan ${bulkData.grades.length} nilai`);
      setHasChanges(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan nilai');
    } finally {
      setSaving(false);
    }
  };

  const getAssignmentLabel = (assignment) => {
    if (!assignment) return '';
    const teacher = assignment.teacher_profile?.user?.name || 'Unknown';
    const className = assignment.class_subject?.school_class?.name || 'Unknown';
    const subjectCode = assignment.class_subject?.subject?.code || '';
    const subjectName = assignment.class_subject?.subject?.name || 'Unknown';
    const year = assignment.class_subject?.academic_year?.year || '';
    return `${teacher} — ${className} — ${subjectCode} ${subjectName} — ${year}`;
  };

  if (loading) {
    return <LoadingScreen message="Memuat data..." />;
  }

  const canInput = selectedAssignment && selectedComponent && weekNumber && academicYear && semester;

  return (
    <AppLayout currentPage="weekly-grade-input">
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
          onClick={() => navigate('/grades/weekly')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Kembali ke Nilai Mingguan</span>
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Input Nilai Mingguan</h1>
        <p className="mt-1 text-sm text-slate-600">
          Masukkan nilai siswa secara cepat berdasarkan kelas dan mata pelajaran
        </p>
      </div>

      {/* Selection Form */}
      <Card className="mb-6 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pilih Kelas dan Komponen Nilai</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Assignment Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Kelas & Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Pilih kelas dan mata pelajaran</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {getAssignmentLabel(assignment)}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Component Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Komponen Nilai <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Pilih komponen</option>
              {gradeComponents.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.code} - {component.name}
                </option>
              ))}
            </select>
          </div>

          {/* Week Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Minggu Ke- <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="52"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              placeholder="1-52"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Assessment Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tanggal Penilaian
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Academic Info */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tahun Ajaran & Semester
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {academicYear?.year} - Semester {semester?.semester_number}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Cards */}
      {canInput && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Siswa</p>
                <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50">
                <Users className="text-blue-600" size={20} strokeWidth={2} />
              </div>
            </div>
          </Card>
          <Card className="p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Sudah Diisi</p>
                <p className="text-2xl font-bold text-slate-900">{filledCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50">
                <CheckCircle2 className="text-emerald-600" size={20} strokeWidth={2} />
              </div>
            </div>
          </Card>
          <Card className="p-5 border-l-4 border-l-amber-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Rata-rata</p>
                <p className="text-2xl font-bold text-slate-900">{averageScore}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50">
                <TrendingUp className="text-amber-600" size={20} strokeWidth={2} />
              </div>
            </div>
          </Card>
          <Card className="p-5 border-l-4 border-l-rose-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Nilai Rendah</p>
                <p className="text-2xl font-bold text-slate-900">{lowScoreCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50">
                <AlertCircle className="text-rose-600" size={20} strokeWidth={2} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Actions */}
      {canInput && students.length > 0 && (
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSetAllDefault}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Isi Semua 75
              </button>
              <button
                onClick={handleClearChanges}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Kosongkan
              </button>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-amber-600 font-medium">
                  Ada perubahan yang belum disimpan
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Save size={18} strokeWidth={2} />
                {saving ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Students Table */}
      {canInput && (
        <>
          {loadingStudents ? (
            <Card className="p-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                <p className="text-sm text-slate-600">Memuat siswa...</p>
              </div>
            </Card>
          ) : students.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Users className="mx-auto text-slate-400 mb-4" size={48} strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada siswa</h3>
                <p className="text-sm text-slate-600">
                  Tidak ada siswa di kelas yang dipilih
                </p>
              </div>
            </Card>
          ) : (
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
                        Nilai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Badge
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {students.map((student, index) => {
                      const grade = grades[student.id] || {};
                      const score = grade.score;
                      const hasScore = score !== '' && score !== null && score !== undefined;
                      
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {student.student_id}
                          </td>
                          <td className="px-6 py-4">
                            <WeeklyGradeScoreInput
                              value={score}
                              onChange={(value) => handleScoreChange(student.id, value)}
                              className="w-24"
                            />
                          </td>
                          <td className="px-6 py-4">
                            {hasScore && <ScoreBadge score={score} showLabel={false} />}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={grade.notes || ''}
                              onChange={(e) => handleNotesChange(student.id, e.target.value)}
                              placeholder="Catatan (opsional)"
                              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!canInput && (
        <Card className="p-12">
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-slate-400 mb-4" size={48} strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Siap untuk Input Nilai</h3>
            <p className="text-sm text-slate-600">
              Pilih kelas, mata pelajaran, komponen nilai, dan minggu untuk mulai input nilai
            </p>
          </div>
        </Card>
      )}
    </AppLayout>
  );
};
