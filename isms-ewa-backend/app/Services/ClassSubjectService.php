<?php

namespace App\Services;

use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;

class ClassSubjectService
{
    /**
     * Get subjects by class.
     */
    public function getSubjectsByClass(int $classId, array $filters = []): Collection
    {
        $query = ClassSubject::with(['subject', 'schoolClass'])
            ->where('school_class_id', $classId);

        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $query->byStatus($filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get classes by subject.
     */
    public function getClassesBySubject(int $subjectId, array $filters = []): Collection
    {
        $query = ClassSubject::with(['subject', 'schoolClass'])
            ->where('subject_id', $subjectId);

        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $query->byStatus($filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Assign subject to class.
     */
    public function assignSubjectToClass(int $classId, int $subjectId, bool $isActive = true): ClassSubject
    {
        // Check if already exists (including soft deleted)
        $existing = ClassSubject::withTrashed()
            ->where('school_class_id', $classId)
            ->where('subject_id', $subjectId)
            ->first();

        if ($existing) {
            if ($existing->trashed()) {
                // Restore if soft deleted
                $existing->restore();
                $existing->update(['is_active' => $isActive]);
                return $existing;
            } else {
                // Already exists and not deleted
                throw new \Exception('Assignment sudah ada untuk kelas dan mata pelajaran ini');
            }
        }

        return ClassSubject::create([
            'school_class_id' => $classId,
            'subject_id' => $subjectId,
            'is_active' => $isActive,
        ]);
    }

    /**
     * Remove assignment (soft delete).
     */
    public function removeAssignment(ClassSubject $classSubject): bool
    {
        return $classSubject->delete();
    }

    /**
     * Restore assignment.
     */
    public function restoreAssignment(ClassSubject $classSubject): bool
    {
        return $classSubject->restore();
    }

    /**
     * Update assignment status.
     */
    public function updateAssignmentStatus(ClassSubject $classSubject, bool $isActive): ClassSubject
    {
        $classSubject->update(['is_active' => $isActive]);
        return $classSubject;
    }
}
