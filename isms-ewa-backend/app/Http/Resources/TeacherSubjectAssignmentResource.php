<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherSubjectAssignmentResource extends JsonResource
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
            'teacher_profile' => [
                'id' => $this->teacherProfile->id,
                'name' => $this->teacherProfile->user->name,
                'email' => $this->teacherProfile->user->email,
                'nip' => $this->teacherProfile->nip,
            ],
            'class_subject' => [
                'id' => $this->classSubject->id,
                'school_class' => [
                    'id' => $this->classSubject->schoolClass->id,
                    'name' => $this->classSubject->schoolClass->name,
                    'grade_level' => $this->classSubject->schoolClass->grade_level,
                ],
                'subject' => [
                    'id' => $this->classSubject->subject->id,
                    'code' => $this->classSubject->subject->code,
                    'name' => $this->classSubject->subject->name,
                ],
            ],
            'academic_year' => [
                'id' => $this->academicYear->id,
                'year' => $this->academicYear->year,
                'is_active' => $this->academicYear->is_active,
            ],
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
