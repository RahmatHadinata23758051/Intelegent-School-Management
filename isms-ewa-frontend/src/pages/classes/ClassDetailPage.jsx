import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, User, BookOpen } from 'lucide-react';
import { useClassDetail } from '../../hooks/useClassDetail';
import { useStudents } from '../../hooks/useStudents';
import { AppLayout } from '../../components/layout/AppLayout';
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
      <AppLayout currentPage="class-detail">
        <ErrorState
          title="Failed to load class"
          message={classError}
          onRetry={refetchClass}
        />
      </AppLayout>
    );
  }

  if (!classDetail) {
    return (
      <AppLayout currentPage="class-detail">
        <ErrorState
          title="Class not found"
          message="The class you're looking for doesn't exist"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPage="class-detail">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.CLASSES)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Classes
        </Button>
      </div>

      {/* Class Header */}
      <Card className="mb-8">
        <Card.Body>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{classDetail.name}</h2>
              <p className="text-slate-500 mt-2">Grade Level: <span className="font-semibold text-slate-700">{classDetail.grade_level || '-'}</span></p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen size={32} className="text-blue-600" />
            </div>
          </div>

          {/* Class Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Homeroom Teacher</p>
              <p className="text-slate-900 font-semibold mt-2">{classDetail.homeroom_teacher?.name || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{classDetail.students_count || 0}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Students in Class */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Students in Class</h3>
          </div>
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
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Loading students...</p>
                </div>
              ) : studentsData?.data && studentsData.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="table-header">Name</th>
                        <th className="table-header">Student ID</th>
                        <th className="table-header">Risk Level</th>
                        <th className="table-header">Email</th>
                        <th className="table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.data.map((student) => (
                        <tr key={student.id} className="table-row">
                          <td className="table-cell font-semibold text-slate-900">{student.name}</td>
                          <td className="table-cell text-slate-600">{student.student_id}</td>
                          <td className="table-cell">
                            <RiskBadge level={student.risk_score?.risk_level || 'safe'} />
                          </td>
                          <td className="table-cell text-slate-600">{student.email}</td>
                          <td className="table-cell">
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
    </AppLayout>
  );
};
