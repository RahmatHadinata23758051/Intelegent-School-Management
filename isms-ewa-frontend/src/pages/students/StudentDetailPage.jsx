import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { useStudentDetail } from '../../hooks/useStudentDetail';
import { studentService } from '../../services/studentService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Alert } from '../../components/common/Alert';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { RiskBadge } from '../../components/common/RiskBadge';
import { IconBadge } from '../../components/common/IconBadge';
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
      <ErrorState
        title="Failed to load student"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!student) {
    return (
      <ErrorState
        title="Student not found"
        message="The student you're looking for doesn't exist"
      />
    );
  }

  const riskScore = student.risk_score || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.STUDENTS)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Students
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert type="success" title="Success" message={successMessage} />
      )}

      {/* Student Profile */}
      <Card>
        <Card.Header>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-slate-500 mt-1">Student ID: {student.student_id}</p>
            </div>
            <RiskBadge level={riskScore.risk_level || 'safe'} />
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Email</p>
                <p className="text-slate-900">{student.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Gender</p>
                <p className="text-slate-900 capitalize">{student.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Birth Date</p>
                <p className="text-slate-900">{student.birth_date || '-'}</p>
              </div>
            </div>

            {/* Class & Address */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Class</p>
                <p className="text-slate-900">{student.school_class?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Address</p>
                <p className="text-slate-900">{student.address || '-'}</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Risk Score Card */}
      <Card>
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
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-2">Academic Score</p>
              <p className="text-3xl font-bold text-blue-600">{riskScore.academic_score?.toFixed(2) || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Based on grades</p>
            </div>

            {/* Behavioral Score */}
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-2">Behavioral Score</p>
              <p className="text-3xl font-bold text-amber-600">{riskScore.behavioral_score?.toFixed(2) || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Based on violations</p>
            </div>

            {/* Total Score */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-600 mb-2">Total Score</p>
              <p className="text-3xl font-bold text-slate-900">{riskScore.total_score?.toFixed(2) || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Combined score</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Grades Preview */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900">Recent Grades</h3>
        </Card.Header>
        <Card.Body>
          {student.grades && student.grades.length > 0 ? (
            <div className="space-y-3">
              {student.grades.slice(0, 5).map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{grade.subject || 'Subject'}</p>
                    <p className="text-sm text-slate-500">{grade.semester || 'Semester'}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{grade.score}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No grades recorded</p>
          )}
        </Card.Body>
      </Card>

      {/* Violations Preview */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900">Recent Violations</h3>
        </Card.Header>
        <Card.Body>
          {student.violations && student.violations.length > 0 ? (
            <div className="space-y-3">
              {student.violations.slice(0, 5).map((violation) => (
                <div key={violation.id} className="flex items-start justify-between p-3 bg-rose-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{violation.description || 'Violation'}</p>
                    <p className="text-sm text-slate-500">{violation.created_at || 'Date'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} className="text-rose-600" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No violations recorded</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
