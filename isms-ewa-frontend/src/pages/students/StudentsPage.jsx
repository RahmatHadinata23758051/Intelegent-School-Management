import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useStudents } from '../../hooks/useStudents';
import { useClasses } from '../../hooks/useClasses';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SearchInput } from '../../components/common/SearchInput';
import { SelectFilter } from '../../components/common/SelectFilter';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { RiskBadge } from '../../components/common/RiskBadge';
import { getStudentDetailRoute } from '../../constants/routes';

export const StudentsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  const { data: studentsData, loading: studentsLoading, error: studentsError, params, updateParams, goToPage, refetch } = useStudents();
  const { data: classesData, loading: classesLoading } = useClasses({ per_page: 100 });

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value });
  };

  const handleClassFilter = (value) => {
    setSelectedClass(value);
    updateParams({ school_class_id: value || undefined });
  };

  const handleRiskFilter = (value) => {
    setSelectedRisk(value);
    updateParams({ risk_level: value || undefined });
  };

  const handleClearSearch = () => {
    setSearch('');
    updateParams({ search: '' });
  };

  const classOptions = classesData?.data?.map((cls) => ({
    value: cls.id,
    label: cls.name,
  })) || [];

  const riskOptions = [
    { value: 'safe', label: 'Safe' },
    { value: 'warning', label: 'Warning' },
    { value: 'high_risk', label: 'High Risk' },
  ];

  if (studentsLoading) {
    return <LoadingScreen message="Loading students..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-500 mt-1">Manage and monitor student information</p>
        </div>
        <Button variant="primary" size="lg" className="flex items-center gap-2">
          <Plus size={20} />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchInput
              value={search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search by name, ID, or email..."
            />
            <SelectFilter
              label="Class"
              value={selectedClass}
              onChange={handleClassFilter}
              options={classOptions}
              placeholder="All Classes"
            />
            <SelectFilter
              label="Risk Level"
              value={selectedRisk}
              onChange={handleRiskFilter}
              options={riskOptions}
              placeholder="All Levels"
            />
            <div className="flex items-end">
              <Button
                variant="outline"
                size="md"
                onClick={refetch}
                className="w-full"
              >
                Refresh
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Error State */}
      {studentsError && (
        <ErrorState
          title="Failed to load students"
          message={studentsError}
          onRetry={refetch}
        />
      )}

      {/* Students Table */}
      {!studentsError && (
        <>
          {studentsData?.data && studentsData.data.length > 0 ? (
            <Card>
              <Card.Body className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Student ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Class</th>
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
                          <td className="px-6 py-4 text-sm text-slate-600">{student.school_class?.name || '-'}</td>
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
              </Card.Body>
            </Card>
          ) : (
            <EmptyState
              icon={Users}
              title="No students found"
              description="Try adjusting your search or filter criteria"
            />
          )}

          {/* Pagination */}
          {studentsData?.meta && (
            <div className="flex justify-center">
              <Pagination
                currentPage={studentsData.meta.current_page}
                totalPages={studentsData.meta.last_page}
                onPageChange={goToPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
