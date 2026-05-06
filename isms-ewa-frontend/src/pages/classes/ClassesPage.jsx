import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';
import { useClasses } from '../../hooks/useClasses';
import { useAuth } from '../../hooks/useAuth';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Classes</h1>
          <p className="text-slate-500 mt-1">Manage school classes and homeroom teachers</p>
        </div>
        {canCreateClass && (
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Plus size={20} />
            Add Class
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesData.data.map((cls) => (
                  <Card
                    key={cls.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(getClassDetailRoute(cls.id))}
                  >
                    <Card.Body>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen size={24} className="text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{cls.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Grade Level:</span>
                          <span className="font-medium text-slate-900">{cls.grade_level || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Homeroom Teacher:</span>
                          <span className="font-medium text-slate-900">{cls.homeroom_teacher?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Students:</span>
                          <span className="font-medium text-slate-900">{cls.students_count || 0}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
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
    </div>
  );
};
