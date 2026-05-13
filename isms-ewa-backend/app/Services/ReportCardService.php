<?php

namespace App\Services;

use App\Models\Student;
use App\Models\ReportCard;
use App\Models\StudentAcademicSummary;
use Illuminate\Support\Facades\DB;

class ReportCardService
{
    protected $academicRecapService;
    
    public function __construct(AcademicRecapService $academicRecapService)
    {
        $this->academicRecapService = $academicRecapService;
    }
    
    /**
     * Generate report card for a student
     */
    public function generateReportCard($student, $academicYear, $semester, $generatedBy)
    {
        // First, ensure academic summary exists
        $summary = StudentAcademicSummary::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->where('semester_id', $semester->id)
            ->first();
        
        if (!$summary) {
            // Generate summary if it doesn't exist
            $summary = $this->academicRecapService->generateStudentSummary(
                $student,
                $academicYear,
                $semester,
                $generatedBy
            );
        }
        
        // Generate report card number
        $reportNumber = $this->generateReportCardNumber($student, $academicYear, $semester);
        
        // Build snapshots
        $subjectGrades = $this->buildSubjectGradesSnapshot($student, $academicYear, $semester);
        $attendanceSnapshot = $this->buildAttendanceSnapshot($student, $academicYear, $semester);
        $violationSnapshot = $this->buildViolationSnapshot($student, $academicYear, $semester);
        $academicSummarySnapshot = $this->buildAcademicSummarySnapshot($summary);
        
        // Create or update report card
        $reportCard = ReportCard::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $academicYear->id,
                'semester_id' => $semester->id,
            ],
            [
                'school_class_id' => $student->school_class_id,
                'student_academic_summary_id' => $summary->id,
                'report_number' => $reportNumber,
                'status' => ReportCard::STATUS_GENERATED,
                'subject_grades' => $subjectGrades,
                'attendance_summary' => $attendanceSnapshot,
                'violation_summary' => $violationSnapshot,
                'academic_summary' => $academicSummarySnapshot,
                'generated_at' => now(),
                'generated_by' => $generatedBy,
            ]
        );
        
        return $reportCard;
    }
    
    /**
     * Generate report card number
     * Format: RC/{year}/{semester}/{class}/{student_id}
     */
    public function generateReportCardNumber($student, $academicYear, $semester)
    {
        // Extract first year from format "2025/2026" -> "2025"
        $year = explode('/', $academicYear->year)[0];
        $semesterNumber = $semester->semester_number;
        $classCode = $student->schoolClass->code ?? 'NOCLASS';
        $studentId = str_pad($student->id, 4, '0', STR_PAD_LEFT);
        
        return "RC/{$year}/{$semesterNumber}/{$classCode}/{$studentId}";
    }
    
    /**
     * Build subject grades snapshot
     */
    public function buildSubjectGradesSnapshot($student, $academicYear, $semester)
    {
        $breakdown = $this->academicRecapService->getSubjectGradeBreakdown($student, $academicYear, $semester);
        
        return [
            'total_subjects' => $breakdown['total_subjects'],
            'average_score' => $breakdown['average_score'],
            'subjects' => $breakdown['subjects']->map(function ($subject) {
                return [
                    'subject_code' => $subject['subject_code'],
                    'subject_name' => $subject['subject_name'],
                    'average_score' => $subject['average_score'],
                    'grade_count' => $subject['grade_count'],
                ];
            })->toArray(),
        ];
    }
    
    /**
     * Build attendance snapshot
     */
    public function buildAttendanceSnapshot($student, $academicYear, $semester)
    {
        $recap = $this->academicRecapService->getAttendanceRecap($student, $academicYear, $semester);
        
        return [
            'total_sessions' => $recap['total_sessions'],
            'present_count' => $recap['present_count'],
            'sick_count' => $recap['sick_count'],
            'permitted_count' => $recap['permitted_count'],
            'absent_count' => $recap['absent_count'],
            'late_count' => $recap['late_count'],
            'attendance_rate' => $recap['attendance_rate'],
        ];
    }
    
    /**
     * Build violation snapshot
     */
    public function buildViolationSnapshot($student, $academicYear, $semester)
    {
        $recap = $this->academicRecapService->getViolationRecap($student, $academicYear, $semester);
        
        return [
            'total_count' => $recap['total_count'],
            'minor_count' => $recap['minor_count'],
            'moderate_count' => $recap['moderate_count'],
            'major_count' => $recap['major_count'],
            'severe_count' => $recap['severe_count'],
            'violations' => $recap['violations']->map(function ($violation) {
                return [
                    'description' => $violation->description,
                    'severity' => $violation->severity,
                    'reported_date' => $violation->reported_date,
                ];
            })->toArray(),
        ];
    }
    
    /**
     * Build academic summary snapshot
     */
    public function buildAcademicSummarySnapshot($summary)
    {
        return [
            'average_score' => $summary->average_score,
            'min_score' => $summary->min_score,
            'max_score' => $summary->max_score,
            'low_score_count' => $summary->low_score_count,
            'attendance_rate' => $summary->attendance_rate,
            'violation_count' => $summary->violation_count,
            'academic_status' => $summary->academic_status,
            'attendance_status' => $summary->attendance_status,
            'behavior_status' => $summary->behavior_status,
            'overall_status' => $summary->overall_status,
        ];
    }
    
    /**
     * Update report card notes
     */
    public function updateReportCardNotes($reportCard, $data)
    {
        $updateData = [];
        
        if (isset($data['notes'])) {
            $updateData['notes'] = $data['notes'];
        }
        
        if (isset($data['homeroom_notes'])) {
            $updateData['homeroom_notes'] = $data['homeroom_notes'];
        }
        
        if (!empty($updateData)) {
            $reportCard->update($updateData);
        }
        
        return $reportCard;
    }
    
    /**
     * Approve report card
     */
    public function approveReportCard($reportCard, $approvedBy)
    {
        $reportCard->update([
            'status' => ReportCard::STATUS_APPROVED,
            'approved_at' => now(),
            'approved_by' => $approvedBy,
        ]);
        
        return $reportCard;
    }
}
