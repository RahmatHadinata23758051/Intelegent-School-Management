import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, AlertCircle, TrendingUp, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { useStudentDetail } from '../../hooks/useStudentDetail';
import { studentService } from '../../services/studentService';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Alert } from '../../components/common/Alert';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ROUTES } from '../../constants/routes';

export const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: student, loading, error, refetch } = useStudentDetail(id);
  const [recalculating, setRecalculating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRecalculateRisk = async () => {
    try {
      setRecalculating(true);
      setSuccessMessage('');
      await studentService.recalculateRisk(id);
      setSuccessMessage('Risk score recalculated successfully');
      refetch();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Recalculate error:', err);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading student details..." />;
  }

  if (error) {
    return (
      <AppLayout currentPage="student-detail">
        <ErrorState
          title="Failed to load student"
          message={error}
          onRetry={refetch}
        />
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout currentPage="student-detail">
        <ErrorState
          title="Student not found"
          message="The student you're looking for doesn't exist"
        />
      </AppLayout>
    );
  }

  const riskScore = student.risk_score || {};

  return (
    <AppLayout currentPage="student-detail">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.STUDENTS)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Students
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert type="success" title="Success" message={successMessage} />
      )}

      {/* Student Profile Header */}
      <Card className="mb-8">
        <Card.Body>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-slate-500 mt-2">Student ID: <span className="font-semibold text-slate-700">{student.student_id}</span></p>
            </div>
            <RiskBadge level={riskScore.risk_level || 'safe'} />
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</p>
              <p className="text-slate-900 font-medium mt-2">{student.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Gender</p>
              <p className="text-slate-900 font-medium mt-2 capitalize">{student.gender || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Birth Date</p>
              <p className="text-slate-900 font-medium mt-2">{student.birth_date || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Class</p>
              <p className="text-slate-900 font-medium mt-2">{student.school_class?.name || '-'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Address</p>
            <p className="text-slate-900 font-medium mt-2">{student.address || '-'}</p>
          </div>
        </Card.Body>
      </Card>

      {/* Risk Score Analysis */}
      <Card className="mb-8">
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Risk Score Analysis</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateRisk}
              loading={recalculating}
              disabled={recalculating}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Recalculate
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Score */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Academic Score</p>
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-600">{riskScore.academic_score?.toFixed(2) || 0}</p>
              <p className="text-xs text-slate-600 mt-3">Based on grades performance</p>
            </div>

            {/* Behavioral Score */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Behavioral Score</p>
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <p className="text-4xl font-bold text-amber-600">{riskScore.behavioral_score?.toFixed(2) || 0}</p>
              <p className="text-xs text-slate-600 mt-3">Based on violations</p>
            </div>

            {/* Total Score */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Total Score</p>
                <div className="w-6 h-6 bg-slate-300 rounded-full" />
              </div>
              <p className="text-4xl font-bold text-slate-900">{riskScore.total_score?.toFixed(2) || 0}</p>
              <p className="text-xs text-slate-600 mt-3">Combined risk score</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Grades & Violations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Grades */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Grades</h3>
            </div>
          </Card.Header>
          <Card.Body>
            {student.grades && student.grades.length > 0 ? (
              <div className="space-y-3">
                {student.grades.slice(0, 5).map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">{grade.subject || 'Subject'}</p>
                      <p className="text-xs text-slate-500 mt-1">{grade.semester || 'Semester'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{grade.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No grades recorded</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Recent Violations */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Violations</h3>
            </div>
          </Card.Header>
          <Card.Body>
            {student.violations && student.violations.length > 0 ? (
              <div className="space-y-3">
                {student.violations.slice(0, 5).map((violation) => (
                  <div key={violation.id} className="flex items-start justify-between p-4 bg-rose-50 rounded-lg border border-rose-200 hover:border-rose-300 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{violation.description || 'Violation'}</p>
                      <p className="text-xs text-slate-500 mt-1">{violation.created_at || 'Date'}</p>
                    </div>
                    <AlertCircle size={20} className="text-rose-600 flex-shrink-0 ml-3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No violations recorded</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </AppLayout>
  );
};
