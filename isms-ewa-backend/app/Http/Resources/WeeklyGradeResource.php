<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeeklyGradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student' => [
                'id' => $this->student->id,
                'name' => $this->student->name,
                'student_id' => $this->student->student_id,
                'email' => $this->student->email,
            ],
            'teacher_subject_assignment_id' => $this->teacher_subject_assignment_id,
            'teacher_subject_assignment' => [
                'id' => $this->teacherSubjectAssignment->id,
                'teacher_profile' => [
                    'id' => $this->teacherSubjectAssignment->teacherProfile->id,
                    'name' => $this->teacherSubjectAssignment->teacherProfile->name,
                    'nip' => $this->teacherSubjectAssignment->teacherProfile->nip,
                ],
                'class_subject' => [
                    'id' => $this->teacherSubjectAssignment->classSubject->id,
                    'school_class' => [
                        'id' => $this->teacherSubjectAssignment->classSubject->schoolClass->id,
                        'name' => $this->teacherSubjectAssignment->classSubject->schoolClass->name,
                    ],
                    'subject' => [
                        'id' => $this->teacherSubjectAssignment->classSubject->subject->id,
                        'name' => $this->teacherSubjectAssignment->classSubject->subject->name,
                        'code' => $this->teacherSubjectAssignment->classSubject->subject->code,
                    ],
                ],
            ],
            'grade_component_id' => $this->grade_component_id,
            'grade_component' => [
                'id' => $this->gradeComponent->id,
                'code' => $this->gradeComponent->code,
                'name' => $this->gradeComponent->name,
            ],
            'academic_year_id' => $this->academic_year_id,
            'academic_year' => [
                'id' => $this->academicYear->id,
                'year' => $this->academicYear->year,
            ],
            'semester_id' => $this->semester_id,
            'semester' => [
                'id' => $this->semester->id,
                'semester_number' => $this->semester->semester_number,
                'name' => $this->semester->name,
            ],
            'week_number' => $this->week_number,
            'assessment_date' => $this->assessment_date?->toDateString(),
            'score' => $this->score,
            'notes' => $this->notes,
            'recorded_by' => $this->recorded_by,
            'recorded_by_user' => $this->recordedBy ? [
                'id' => $this->recordedBy->id,
                'name' => $this->recordedBy->name,
                'email' => $this->recordedBy->email,
            ] : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
