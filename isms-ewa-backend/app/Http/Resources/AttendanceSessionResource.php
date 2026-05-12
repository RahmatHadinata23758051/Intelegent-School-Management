<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceSessionResource extends JsonResource
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
            'school_class_id' => $this->school_class_id,
            'school_class' => [
                'id' => $this->schoolClass->id,
                'name' => $this->schoolClass->name,
                'grade_level' => $this->schoolClass->grade_level,
            ],
            'academic_year_id' => $this->academic_year_id,
            'academic_year' => [
                'id' => $this->academicYear->id,
                'name' => $this->academicYear->name,
                'start_date' => $this->academicYear->start_date->format('Y-m-d'),
                'end_date' => $this->academicYear->end_date->format('Y-m-d'),
            ],
            'semester_id' => $this->semester_id,
            'semester' => [
                'id' => $this->semester->id,
                'name' => $this->semester->name,
                'start_date' => $this->semester->start_date->format('Y-m-d'),
                'end_date' => $this->semester->end_date->format('Y-m-d'),
            ],
            'session_date' => $this->session_date->format('Y-m-d'),
            'session_type' => $this->session_type,
            'notes' => $this->notes,
            'is_locked' => $this->is_locked,
            'created_by' => $this->created_by,
            'creator' => $this->when($this->createdBy, [
                'id' => $this->createdBy?->id,
                'name' => $this->createdBy?->name,
                'email' => $this->createdBy?->email,
            ]),
            'attendances_count' => $this->when(
                $this->relationLoaded('attendances'),
                fn() => $this->attendances->count()
            ),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
