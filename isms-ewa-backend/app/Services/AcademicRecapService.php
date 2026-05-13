<?php

namespace App\Services;

use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\StudentAcademicSummary;
use App\Models\WeeklyGrade;
use App\Models\Attendance;
use App\Models\Violation;
use App\Models\AttendanceSession;
use Illuminate\Support\Facades\DB;

class AcademicRecapService
{
    /**
     * Generate academic summary for a single student
     */
    public function generateStudentSummary($student, $academicYear, $semester, $generatedBy)
    {
        // Get subject grade breakdown
        $subjectBreakdown = $this->getSubjectGradeBreakdown($student, $academicYear, $semester);
        
        // Get attendance recap
        $attendanceRecap = $this->getAttendanceRecap($student, $academicYear, $semester);
        
        // Get violation recap
        $violationRecap = $this->getViolationRecap($student, $academicYear, $semester);
        
        // Calculate statuses
        $academicStatus = $this->calculateAcademicStatus($subjectBreakdown['average_score']);
        $attendanceStatus = $this->calculateAttendanceStatus($attendanceRecap['attendance_rate']);
        $behaviorStatus = $this->calculateBehaviorStatus($violationRecap);
        $overallStatus = $this->calculateOverallStatus($academicStatus, $attendanceStatus, $behaviorStatus);
        
        // Create or update summary
        $summary = StudentAcademicSummary::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $academicYear->id,
                'semester_id' => $semester->id,
            ],
            [
                'school_class_id' => $student->school_class_id,
                'total_subjects' => $subjectBreakdown['total_subjects'],
                'average_score' => $subjectBreakdown['average_score'],
                'min_score' => $subjectBreakdown['min_score'],
                'max_score' => $subjectBreakdown['max_score'],
                'low_score_count' => $subjectBreakdown['low_score_count'],
                'attendance_rate' => $attendanceRecap['attendance_rate'],
                'present_count' => $attendanceRecap['present_count'],
                'sick_count' => $attendanceRecap['sick_count'],
                'permitted_count' => $attendanceRecap['permitted_count'],
                'absent_count' => $attendanceRecap['absent_count'],
                'late_count' => $attendanceRecap['late_count'],
                'violation_count' => $violationRecap['total_count'],
                'minor_violation_count' => $violationRecap['minor_count'],
                'moderate_violation_count' => $violationRecap['moderate_count'],
                'major_violation_count' => $violationRecap['major_count'],
                'severe_violation_count' => $violationRecap['severe_count'],
                'academic_status' => $academicStatus,
                'attendance_status' => $attendanceStatus,
                'behavior_status' => $behaviorStatus,
                'overall_status' => $overallStatus,
                'generated_at' => now(),
                'generated_by' => $generatedBy,
            ]
        );
        
        return $summary;
    }
    
    /**
     * Generate academic summaries for all students in a class
     */
    public function generateClassSummary($schoolClass, $academicYear, $semester, $generatedBy)
    {
        $students = $schoolClass->students;
        $summaries = [];
        
        foreach ($students as $student) {
            $summaries[] = $this->generateStudentSummary($student, $academicYear, $semester, $generatedBy);
        }
        
        return $summaries;
    }
    
    /**
     * Get subject grade breakdown for a student
     */
    public function getSubjectGradeBreakdown($student, $academicYear, $semester)
    {
        // Get all weekly grades for the student in this semester
        $weeklyGrades = WeeklyGrade::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->where('semester_id', $semester->id)
            ->with(['teacherSubjectAssignment.classSubject.subject'])
            ->get();
        
        // Group by subject and calculate averages
        $subjectGrades = $weeklyGrades->groupBy(function ($grade) {
            return $grade->teacherSubjectAssignment->classSubject->subject_id;
        })->map(function ($grades, $subjectId) {
            $subject = $grades->first()->teacherSubjectAssignment->classSubject->subject;
            $averageScore = $grades->avg('score');
            
            return [
                'subject_id' => $subjectId,
                'subject_code' => $subject->code,
                'subject_name' => $subject->name,
                'grade_count' => $grades->count(),
                'average_score' => round($averageScore, 2),
                'min_score' => round($grades->min('score'), 2),
                'max_score' => round($grades->max('score'), 2),
            ];
        })->values();
        
        // Calculate overall statistics
        $totalSubjects = $subjectGrades->count();
        $averageScore = $totalSubjects > 0 ? round($subjectGrades->avg('average_score'), 2) : 0;
        $minScore = $totalSubjects > 0 ? round($subjectGrades->min('average_score'), 2) : 0;
        $maxScore = $totalSubjects > 0 ? round($subjectGrades->max('average_score'), 2) : 0;
        $lowScoreCount = $subjectGrades->filter(function ($subject) {
            return $subject['average_score'] < 70;
        })->count();
        
        return [
            'total_subjects' => $totalSubjects,
            'average_score' => $averageScore,
            'min_score' => $minScore,
            'max_score' => $maxScore,
            'low_score_count' => $lowScoreCount,
            'subjects' => $subjectGrades,
        ];
    }
    
    /**
     * Get attendance recap for a student
     */
    public function getAttendanceRecap($student, $academicYear, $semester)
    {
        // Get all attendance sessions for this semester
        $sessionIds = AttendanceSession::where('school_class_id', $student->school_class_id)
            ->where('academic_year_id', $academicYear->id)
            ->where('semester_id', $semester->id)
            ->pluck('id');
        
        // Get attendance records for the student
        $attendances = Attendance::whereIn('attendance_session_id', $sessionIds)
            ->where('student_id', $student->id)
            ->get();
        
        // Count by status
        $presentCount = $attendances->where('status', Attendance::STATUS_PRESENT)->count();
        $sickCount = $attendances->where('status', Attendance::STATUS_SICK)->count();
        $permittedCount = $attendances->where('status', Attendance::STATUS_PERMITTED)->count();
        $absentCount = $attendances->where('status', Attendance::STATUS_ABSENT)->count();
        $lateCount = $attendances->where('status', Attendance::STATUS_LATE)->count();
        
        $totalSessions = $attendances->count();
        
        // Calculate attendance rate: (present + permitted + late) / total * 100
        $attendanceRate = $totalSessions > 0 
            ? round((($presentCount + $permittedCount + $lateCount) / $totalSessions) * 100, 2)
            : 0;
        
        return [
            'total_sessions' => $totalSessions,
            'present_count' => $presentCount,
            'sick_count' => $sickCount,
            'permitted_count' => $permittedCount,
            'absent_count' => $absentCount,
            'late_count' => $lateCount,
            'attendance_rate' => $attendanceRate,
        ];
    }
    
    /**
     * Get violation recap for a student
     */
    public function getViolationRecap($student, $academicYear, $semester)
    {
        // Get violations within the semester date range
        $violations = Violation::where('student_id', $student->id)
            ->whereBetween('reported_date', [
                $semester->start_date,
                $semester->end_date,
            ])
            ->get();
        
        // Count by severity
        $minorCount = $violations->where('severity', 'minor')->count();
        $moderateCount = $violations->where('severity', 'moderate')->count();
        $majorCount = $violations->where('severity', 'major')->count();
        $severeCount = $violations->where('severity', 'severe')->count();
        
        return [
            'total_count' => $violations->count(),
            'minor_count' => $minorCount,
            'moderate_count' => $moderateCount,
            'major_count' => $majorCount,
            'severe_count' => $severeCount,
            'violations' => $violations,
        ];
    }
    
    /**
     * Calculate academic status based on average score
     */
    public function calculateAcademicStatus($averageScore)
    {
        if ($averageScore >= 90) {
            return 'excellent';
        } elseif ($averageScore >= 80) {
            return 'good';
        } elseif ($averageScore >= 70) {
            return 'fair';
        } elseif ($averageScore >= 60) {
            return 'poor';
        } else {
            return 'critical';
        }
    }
    
    /**
     * Calculate attendance status based on attendance rate
     */
    public function calculateAttendanceStatus($attendanceRate)
    {
        if ($attendanceRate >= 95) {
            return 'excellent';
        } elseif ($attendanceRate >= 85) {
            return 'good';
        } elseif ($attendanceRate >= 75) {
            return 'warning';
        } else {
            return 'poor';
        }
    }
    
    /**
     * Calculate behavior status based on violation data
     */
    public function calculateBehaviorStatus($violationData)
    {
        $totalCount = $violationData['total_count'];
        $majorCount = $violationData['major_count'];
        $severeCount = $violationData['severe_count'];
        $moderateCount = $violationData['moderate_count'];
        
        if ($totalCount === 0) {
            return 'clean';
        } elseif ($severeCount > 0 || $majorCount > 0) {
            return 'serious';
        } elseif ($moderateCount > 0) {
            return 'warning';
        } else {
            return 'minor_issue';
        }
    }
    
    /**
     * Calculate overall status based on all statuses
     */
    public function calculateOverallStatus($academicStatus, $attendanceStatus, $behaviorStatus)
    {
        // Critical if any component is critical/serious/poor
        if ($academicStatus === 'critical' || $attendanceStatus === 'poor' || $behaviorStatus === 'serious') {
            return 'critical';
        }
        
        // Warning if any component is poor/warning
        if ($academicStatus === 'poor' || $attendanceStatus === 'warning' || $behaviorStatus === 'warning') {
            return 'warning';
        }
        
        // Fair if academic is fair or behavior has minor issues
        if ($academicStatus === 'fair' || $behaviorStatus === 'minor_issue') {
            return 'fair';
        }
        
        // Good if all components are good or better
        if ($academicStatus === 'good' && $attendanceStatus === 'good' && $behaviorStatus === 'clean') {
            return 'good';
        }
        
        // Excellent if all components are excellent
        if ($academicStatus === 'excellent' && $attendanceStatus === 'excellent' && $behaviorStatus === 'clean') {
            return 'excellent';
        }
        
        // Default to good
        return 'good';
    }
}
