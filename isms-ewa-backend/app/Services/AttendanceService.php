<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    /**
     * Calculate attendance rate for a student
     * Formula: ((present + permitted + late) / total_sessions) * 100
     */
    public function calculateAttendanceRate(int $studentId, ?int $academicYearId = null, ?int $semesterId = null, ?string $dateFrom = null, ?string $dateTo = null): array
    {
        $query = Attendance::where('student_id', $studentId);

        // Filter by academic year, semester, or date range through session
        $query->whereHas('attendanceSession', function ($q) use ($academicYearId, $semesterId, $dateFrom, $dateTo) {
            if ($academicYearId) {
                $q->where('academic_year_id', $academicYearId);
            }
            if ($semesterId) {
                $q->where('semester_id', $semesterId);
            }
            if ($dateFrom && $dateTo) {
                $q->whereBetween('session_date', [$dateFrom, $dateTo]);
            }
        });

        $attendances = $query->get();
        $totalSessions = $attendances->count();

        if ($totalSessions === 0) {
            return [
                'total_sessions' => 0,
                'present_count' => 0,
                'sick_count' => 0,
                'permitted_count' => 0,
                'absent_count' => 0,
                'late_count' => 0,
                'attendance_rate' => 0,
            ];
        }

        $presentCount = $attendances->where('status', Attendance::STATUS_PRESENT)->count();
        $sickCount = $attendances->where('status', Attendance::STATUS_SICK)->count();
        $permittedCount = $attendances->where('status', Attendance::STATUS_PERMITTED)->count();
        $absentCount = $attendances->where('status', Attendance::STATUS_ABSENT)->count();
        $lateCount = $attendances->where('status', Attendance::STATUS_LATE)->count();

        // Attendance rate: (present + permitted + late) / total * 100
        $attendanceRate = (($presentCount + $permittedCount + $lateCount) / $totalSessions) * 100;

        return [
            'total_sessions' => $totalSessions,
            'present_count' => $presentCount,
            'sick_count' => $sickCount,
            'permitted_count' => $permittedCount,
            'absent_count' => $absentCount,
            'late_count' => $lateCount,
            'attendance_rate' => round($attendanceRate, 2),
        ];
    }

    /**
     * Get attendance recap for a class
     */
    public function getClassAttendanceRecap(int $classId, ?int $academicYearId = null, ?int $semesterId = null, ?string $dateFrom = null, ?string $dateTo = null): array
    {
        $sessionsQuery = AttendanceSession::where('school_class_id', $classId);

        if ($academicYearId) {
            $sessionsQuery->where('academic_year_id', $academicYearId);
        }
        if ($semesterId) {
            $sessionsQuery->where('semester_id', $semesterId);
        }
        if ($dateFrom && $dateTo) {
            $sessionsQuery->whereBetween('session_date', [$dateFrom, $dateTo]);
        }

        $sessions = $sessionsQuery->with('attendances')->get();
        $totalSessions = $sessions->count();

        if ($totalSessions === 0) {
            return [
                'total_sessions' => 0,
                'students' => [],
            ];
        }

        // Get all students in class
        $students = Student::where('school_class_id', $classId)->get();

        $studentsRecap = [];
        foreach ($students as $student) {
            $attendances = Attendance::where('student_id', $student->id)
                ->whereIn('attendance_session_id', $sessions->pluck('id'))
                ->get();

            $presentCount = $attendances->where('status', Attendance::STATUS_PRESENT)->count();
            $sickCount = $attendances->where('status', Attendance::STATUS_SICK)->count();
            $permittedCount = $attendances->where('status', Attendance::STATUS_PERMITTED)->count();
            $absentCount = $attendances->where('status', Attendance::STATUS_ABSENT)->count();
            $lateCount = $attendances->where('status', Attendance::STATUS_LATE)->count();

            $attendanceRate = $totalSessions > 0
                ? (($presentCount + $permittedCount + $lateCount) / $totalSessions) * 100
                : 0;

            $studentsRecap[] = [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'student_number' => $student->student_id,
                'total_sessions' => $totalSessions,
                'present_count' => $presentCount,
                'sick_count' => $sickCount,
                'permitted_count' => $permittedCount,
                'absent_count' => $absentCount,
                'late_count' => $lateCount,
                'attendance_rate' => round($attendanceRate, 2),
            ];
        }

        return [
            'total_sessions' => $totalSessions,
            'students' => $studentsRecap,
        ];
    }

    /**
     * Get attendance summary statistics
     */
    public function getAttendanceSummary(?int $academicYearId = null, ?int $semesterId = null): array
    {
        $query = AttendanceSession::query();

        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }
        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        $totalSessions = $query->count();
        $lockedSessions = (clone $query)->where('is_locked', true)->count();
        $unlockedSessions = (clone $query)->where('is_locked', false)->count();

        $attendanceQuery = Attendance::query();
        if ($academicYearId || $semesterId) {
            $attendanceQuery->whereHas('attendanceSession', function ($q) use ($academicYearId, $semesterId) {
                if ($academicYearId) {
                    $q->where('academic_year_id', $academicYearId);
                }
                if ($semesterId) {
                    $q->where('semester_id', $semesterId);
                }
            });
        }

        $totalAttendances = $attendanceQuery->count();
        $presentCount = (clone $attendanceQuery)->where('status', Attendance::STATUS_PRESENT)->count();
        $sickCount = (clone $attendanceQuery)->where('status', Attendance::STATUS_SICK)->count();
        $permittedCount = (clone $attendanceQuery)->where('status', Attendance::STATUS_PERMITTED)->count();
        $absentCount = (clone $attendanceQuery)->where('status', Attendance::STATUS_ABSENT)->count();
        $lateCount = (clone $attendanceQuery)->where('status', Attendance::STATUS_LATE)->count();

        return [
            'total_sessions' => $totalSessions,
            'locked_sessions' => $lockedSessions,
            'unlocked_sessions' => $unlockedSessions,
            'total_attendances' => $totalAttendances,
            'present_count' => $presentCount,
            'sick_count' => $sickCount,
            'permitted_count' => $permittedCount,
            'absent_count' => $absentCount,
            'late_count' => $lateCount,
        ];
    }

    /**
     * Bulk upsert attendances for a session
     */
    public function bulkUpsertAttendances(AttendanceSession $session, array $attendancesData, int $recordedBy): array
    {
        $results = [
            'created' => 0,
            'updated' => 0,
            'errors' => [],
        ];

        DB::beginTransaction();
        try {
            foreach ($attendancesData as $data) {
                $attendance = Attendance::updateOrCreate(
                    [
                        'attendance_session_id' => $session->id,
                        'student_id' => $data['student_id'],
                    ],
                    [
                        'status' => $data['status'],
                        'notes' => $data['notes'] ?? null,
                        'recorded_by' => $recordedBy,
                        'recorded_at' => now(),
                    ]
                );

                if ($attendance->wasRecentlyCreated) {
                    $results['created']++;
                } else {
                    $results['updated']++;
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $results;
    }
}
