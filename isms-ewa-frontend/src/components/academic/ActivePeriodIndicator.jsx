import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { academicYearService } from '../../services/academicYearService';
import { semesterService } from '../../services/semesterService';

/**
 * Active Period Indicator Component
 * Menampilkan tahun ajaran dan semester yang aktif di topbar
 */
export const ActivePeriodIndicator = () => {
  const [activeAcademicYear, setActiveAcademicYear] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePeriod();

    // Set up interval to refresh every 30 seconds
    const interval = setInterval(fetchActivePeriod, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivePeriod = async () => {
    try {
      setLoading(true);
      const [ay, sem] = await Promise.all([
        academicYearService.getActiveAcademicYear(),
        semesterService.getActiveSemester(),
      ]);

      setActiveAcademicYear(ay);
      setActiveSemester(sem);
    } catch (err) {
      console.error('Failed to fetch active period:', err);
    } finally {
      setLoading(false);
    }
  };

  // If no active period, show warning
  if (!activeAcademicYear || !activeSemester) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">
            {!activeAcademicYear ? 'Tidak ada tahun ajaran aktif' : 'Tidak ada semester aktif'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-900">
          Tahun Ajaran Aktif: <span className="font-bold">{activeAcademicYear.year}</span>
          {activeSemester && (
            <>
              {' '} • <span className="font-bold">Semester {activeSemester.semester_number}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
