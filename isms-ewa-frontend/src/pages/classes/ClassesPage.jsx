import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Users, User } from 'lucide-react';
import { useClasses } from '../../hooks/useClasses';
import { useAuth } from '../../hooks/useAuth';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SearchInput } from '../../components/common/SearchInput';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { getClassDetailRoute } from '../../constants/routes';

export const ClassesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const { data: classesData, loading, error, params, updateParams, goToPage, refetch } = useClasses();

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value });
  };

  const handleClearSearch = () => {
    setSearch('');
    updateParams({ search: '' });
  };

  const canCreateClass = user?.role === 'admin';

  if (loading) {
    return <LoadingScreen message="Loading classes..." />;
  }

  return (
    <AppLayout currentPage="classes">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Classes</h2>
          <p className="text-slate-500 mt-1">Manage school classes and homeroom teachers</p>
        </div>
        {canCreateClass && (
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Plus size={20} />
            Add Class
          </Button>
        )}
      </div>

      {/* Search Card */}
      <Card className="mb-8">
        <Card.Body>
          <SearchInput
            value={search}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search by class name or grade level..."
          />
        </Card.Body>
      </Card>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Failed to load classes"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Classes Grid */}
      {!error && (
        <>
          {classesData?.data && classesData.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {classesData.data.map((cls) => (
                  <Card
                    key={cls.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                    onClick={() => navigate(getClassDetailRoute(cls.id))}
                  >
                    <Card.Body>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                          <BookOpen size={28} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {cls.grade_level || 'Grade'}
                        </span>
                      </div>

                      {/* Class Name */}
                      <h3 className="text-lg font-bold text-slate-900 mb-4">{cls.name}</h3>

                      {/* Details */}
                      <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Homeroom Teacher</p>
                            <p className="text-sm font-semibold text-slate-900">{cls.homeroom_teacher?.name || 'Not assigned'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users size={16} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Total Students</p>
                            <p className="text-sm font-semibold text-slate-900">{cls.students_count || 0} students</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(getClassDetailRoute(cls.id));
                        }}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {classesData?.meta && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={classesData.meta.current_page}
                    totalPages={classesData.meta.last_page}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No classes found"
              description="Try adjusting your search criteria"
            />
          )}
        </>
      )}
    </AppLayout>
  );
};
