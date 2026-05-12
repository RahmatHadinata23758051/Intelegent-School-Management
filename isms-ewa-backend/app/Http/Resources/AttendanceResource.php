<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
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
            'attendance_session_id' => $this->attendance_session_id,
            'attendance_session' => $this->when($this->relationLoaded('attendanceSession'), [
                'id' => $this->attendanceSession?->id,
                'session_date' => $this->attendanceSession?->session_date->format('Y-m-d'),
                'session_type' => $this->attendanceSession?->session_type,
                'school_class' => [
                    'id' => $this->attendanceSession?->schoolClass->id,
                    'name' => $this->attendanceSession?->schoolClass->name,
                ],
            ]),
            'student_id' => $this->student_id,
            'student' => [
                'id' => $this->student->id,
                'name' => $this->student->name,
                'student_id' => $this->student->student_id,
                'email' => $this->student->email,
            ],
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'notes' => $this->notes,
            'recorded_by' => $this->recorded_by,
            'recorder' => $this->when($this->recordedBy, [
                'id' => $this->recordedBy?->id,
                'name' => $this->recordedBy?->name,
                'email' => $this->recordedBy?->email,
            ]),
            'recorded_at' => $this->recorded_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    /**
     * Get status label in Indonesian
     */
    private function getStatusLabel(): string
    {
        return match($this->status) {
            'present' => 'Hadir',
            'sick' => 'Sakit',
            'permitted' => 'Izin',
            'absent' => 'Alpa',
            'late' => 'Terlambat',
            default => $this->status,
        };
    }
}
