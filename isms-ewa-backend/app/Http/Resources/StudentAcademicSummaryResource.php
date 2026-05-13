<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentAcademicSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'school_class_id' => $this->school_class_id,
            'academic_year_id' => $this->academic_year_id,
            'semester_id' => $this->semester_id,
            
            // Academic metrics
            'total_subjects' => $this->total_subjects,
            'average_score' => (float) $this->average_score,
            'min_score' => (float) $this->min_score,
            'max_score' => (float) $this->max_score,
            'low_score_count' => $this->low_score_count,
            
            // Attendance metrics
            'attendance_rate' => (float) $this->attendance_rate,
            'present_count' => $this->present_count,
            'sick_count' => $this->sick_count,
            'permitted_count' => $this->permitted_count,
            'absent_count' => $this->absent_count,
            'late_count' => $this->late_count,
            'total_attendance' => $this->total_attendance,
            
            // Violation metrics
            'violation_count' => $this->violation_count,
            'minor_violation_count' => $this->minor_violation_count,
            'moderate_violation_count' => $this->moderate_violation_count,
            'major_violation_count' => $this->major_violation_count,
            'severe_violation_count' => $this->severe_violation_count,
            
            // Status indicators
            'academic_status' => $this->academic_status,
            'attendance_status' => $this->attendance_status,
            'behavior_status' => $this->behavior_status,
            'overall_status' => $this->overall_status,
            'has_critical_issues' => $this->has_critical_issues,
            
            // Metadata
            'generated_at' => $this->generated_at?->toISOString(),
            'generated_by' => $this->generated_by,
            
            // Relationships
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'student_id' => $this->student->student_id,
                ];
            }),
            'school_class' => $this->whenLoaded('schoolClass', function () {
                return [
                    'id' => $this->schoolClass->id,
                    'name' => $this->schoolClass->name,
                    'code' => $this->schoolClass->code,
                ];
            }),
            'academic_year' => $this->whenLoaded('academicYear', function () {
                return [
                    'id' => $this->academicYear->id,
                    'year' => $this->academicYear->year,
                ];
            }),
            'semester' => $this->whenLoaded('semester', function () {
                return [
                    'id' => $this->semester->id,
                    'semester_number' => $this->semester->semester_number,
                ];
            }),
            'generated_by_user' => $this->whenLoaded('generatedBy', function () {
                return [
                    'id' => $this->generatedBy->id,
                    'name' => $this->generatedBy->name,
                ];
            }),
            'report_card' => $this->whenLoaded('reportCard', function () {
                return new ReportCardResource($this->reportCard);
            }),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
