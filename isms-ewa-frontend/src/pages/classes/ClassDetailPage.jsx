import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useClassDetail } from '../../hooks/useClassDetail';
import { useStudents } from '../../hooks/useStudents';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ROUTES } from '../../constants/routes';
import { getStudentDetailRoute } from '../../constants/routes';

export const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: classDetail, loading: classLoading, error: classError, refetch: refetchClass } = useClassDetail(id);
  const { data: studentsData, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents({
    school_class_id: id,
    per_page: 100,
  });

  if (classLoading) {
    return <LoadingScreen message="Loading class details..." />;
  }

  if (classError) {
    return (
      <ErrorState
        title="Failed to load class"
        message={classError}
        onRetry={refetchClass}
      />
    );
  }

  if (!classDetail) {
    return (
      <ErrorState
        title="Class not found"
        message="The class you're looking for doesn't exist"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.CLASSES)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Classes
        </Button>
      </div>

      {/* Class Info */}
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-slate-900">{classDetail.name}</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-600">Grade Level</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{classDetail.grade_level || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Homeroom Teacher</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{classDetail.homeroom_teacher?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{classDetail.students_count || 0}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Students in Class */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900">Students in Class</h3>
        </Card.Header>
        <Card.Body>
          {studentsError && (
            <ErrorState
              title="Failed to load students"
              message={studentsError}
              onRetry={refetchStudents}
            />
          )}

          {!studentsError && (
            <>
              {studentsLoading ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">Loading students...</p>
                </div>
              ) : studentsData?.data && studentsData.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Student ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Risk Level</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.data.map((student) => (
                        <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{student.student_id}</td>
                          <td className="px-6 py-4 text-sm">
                            <RiskBadge level={student.risk_score?.risk_level || 'safe'} />
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(getStudentDetailRoute(student.id))}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No students in this class"
                  description="This class doesn't have any students yet"
                />
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
