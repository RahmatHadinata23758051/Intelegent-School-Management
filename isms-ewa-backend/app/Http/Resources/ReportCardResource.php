<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportCardResource extends JsonResource
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
            'student_academic_summary_id' => $this->student_academic_summary_id,
            
            // Report card details
            'report_number' => $this->report_number,
            'status' => $this->status,
            
            // Snapshots
            'subject_grades' => $this->subject_grades,
            'attendance_summary' => $this->attendance_summary,
            'violation_summary' => $this->violation_summary,
            'academic_summary' => $this->academic_summary,
            
            // Notes
            'notes' => $this->notes,
            'homeroom_notes' => $this->homeroom_notes,
            
            // Status flags
            'is_draft' => $this->is_draft,
            'is_generated' => $this->is_generated,
            'is_reviewed' => $this->is_reviewed,
            'is_approved' => $this->is_approved,
            'can_be_edited' => $this->can_be_edited,
            'can_be_approved' => $this->can_be_approved,
            
            // Metadata
            'generated_at' => $this->generated_at?->toISOString(),
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'generated_by' => $this->generated_by,
            'reviewed_by' => $this->reviewed_by,
            'approved_by' => $this->approved_by,
            
            // Relationships
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'student_id' => $this->student->student_id,
                    'email' => $this->student->email,
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
            'academic_summary' => $this->whenLoaded('studentAcademicSummary', function () {
                return new StudentAcademicSummaryResource($this->studentAcademicSummary);
            }),
            'generated_by_user' => $this->whenLoaded('generatedBy', function () {
                return [
                    'id' => $this->generatedBy->id,
                    'name' => $this->generatedBy->name,
                ];
            }),
            'reviewed_by_user' => $this->whenLoaded('reviewedBy', function () {
                return $this->reviewedBy ? [
                    'id' => $this->reviewedBy->id,
                    'name' => $this->reviewedBy->name,
                ] : null;
            }),
            'approved_by_user' => $this->whenLoaded('approvedBy', function () {
                return $this->approvedBy ? [
                    'id' => $this->approvedBy->id,
                    'name' => $this->approvedBy->name,
                ] : null;
            }),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
