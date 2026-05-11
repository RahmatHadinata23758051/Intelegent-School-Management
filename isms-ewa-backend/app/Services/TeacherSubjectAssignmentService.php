<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\ClassSubject;
use App\Models\TeacherProfile;
use App\Models\TeacherSubjectAssignment;
use Illuminate\Database\Eloquent\Collection;

class TeacherSubjectAssignmentService
{
    /**
     * Get all assignments dengan filter & search.
     */
    public function getAssignments(array $filters = [], array $pagination = [], array $sort = [])
    {
        $query = TeacherSubjectAssignment::with([
            'teacherProfile.user',
            'classSubject.schoolClass',
            'classSubject.subject',
            'academicYear',
        ]);

        // Search
        if (isset($filters['search']) && $filters['search']) {
            $query->search($filters['search']);
        }

        // Search by teacher name
        if (isset($filters['teacher_name']) && $filters['teacher_name']) {
            $query->whereHas('teacherProfile.user', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['teacher_name']}%");
            });
        }

        // Search by teacher email
        if (isset($filters['teacher_email']) && $filters['teacher_email']) {
            $query->whereHas('teacherProfile.user', function ($q) use ($filters) {
                $q->where('email', 'like', "%{$filters['teacher_email']}%");
            });
        }

        // Search by teacher NIP
        if (isset($filters['teacher_nip']) && $filters['teacher_nip']) {
            $query->whereHas('teacherProfile', function ($q) use ($filters) {
                $q->where('nip', 'like', "%{$filters['teacher_nip']}%");
            });
        }

        // Search by class name
        if (isset($filters['class_name']) && $filters['class_name']) {
            $query->whereHas('classSubject.schoolClass', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['class_name']}%");
            });
        }

        // Search by subject code
        if (isset($filters['subject_code']) && $filters['subject_code']) {
            $query->whereHas('classSubject.subject', function ($q) use ($filters) {
                $q->where('code', 'like', "%{$filters['subject_code']}%");
            });
        }

        // Search by subject name
        if (isset($filters['subject_name']) && $filters['subject_name']) {
            $query->whereHas('classSubject.subject', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['subject_name']}%");
            });
        }

        // Filter by teacher_profile_id
        if (isset($filters['teacher_profile_id']) && $filters['teacher_profile_id']) {
            $query->where('teacher_profile_id', $filters['teacher_profile_id']);
        }

        // Filter by school_class_id
        if (isset($filters['school_class_id']) && $filters['school_class_id']) {
            $query->byClass($filters['school_class_id']);
        }

        // Filter by subject_id
        if (isset($filters['subject_id']) && $filters['subject_id']) {
            $query->bySubject($filters['subject_id']);
        }

        // Filter by class_subject_id
        if (isset($filters['class_subject_id']) && $filters['class_subject_id']) {
            $query->where('class_subject_id', $filters['class_subject_id']);
        }

        // Filter by academic_year_id
        if (isset($filters['academic_year_id']) && $filters['academic_year_id']) {
            $query->where('academic_year_id', $filters['academic_year_id']);
        }

        // Filter by is_active
        if (isset($filters['is_active']) && $filters['is_active'] !== 'all') {
            if ($filters['is_active'] === 'true' || $filters['is_active'] === true) {
                $query->where('is_active', true);
            } elseif ($filters['is_active'] === 'false' || $filters['is_active'] === false) {
                $query->where('is_active', false);
            }
        }

        // Sort - simple approach
        $sortBy = $sort['sort_by'] ?? 'created_at';
        $sortOrder = $sort['sort_order'] ?? 'asc';

        if ($sortBy === 'created_at') {
            $query->orderBy('teacher_subject_assignments.created_at', $sortOrder);
        } else {
            $query->orderBy('teacher_subject_assignments.created_at', 'desc');
        }

        // Pagination
        $page = $pagination['page'] ?? 1;
        $perPage = min($pagination['per_page'] ?? 15, 100);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Create assignment baru dengan validasi lengkap.
     */
    public function createAssignment(array $data): TeacherSubjectAssignment
    {
        // Validasi teacher profile aktif
        $teacherProfile = TeacherProfile::findOrFail($data['teacher_profile_id']);
        if (!$teacherProfile->is_active) {
            throw new \Exception('Profil guru tidak aktif');
        }

        // Validasi class subject aktif
        $classSubject = ClassSubject::findOrFail($data['class_subject_id']);
        if (!$classSubject->is_active) {
            throw new \Exception('Penugasan kelas-mata pelajaran tidak aktif');
        }

        // Validasi subject aktif
        if (!$classSubject->subject->is_active) {
            throw new \Exception('Mata pelajaran tidak aktif');
        }

        // Validasi academic year aktif
        $academicYear = AcademicYear::findOrFail($data['academic_year_id']);
        if (!$academicYear->is_active) {
            throw new \Exception('Tahun ajaran tidak aktif');
        }

        // Validasi unique combination
        $existing = TeacherSubjectAssignment::where('teacher_profile_id', $data['teacher_profile_id'])
            ->where('class_subject_id', $data['class_subject_id'])
            ->where('academic_year_id', $data['academic_year_id'])
            ->whereNull('deleted_at')
            ->first();

        if ($existing) {
            throw new \Exception('Assignment guru ke mata pelajaran/kelas sudah ada untuk tahun ajaran ini');
        }

        // Validasi teacher role
        $userRole = $teacherProfile->user->role;
        if (!in_array($userRole, ['teacher', 'homeroom_teacher'])) {
            throw new \Exception('User harus memiliki role guru atau guru piket');
        }

        return TeacherSubjectAssignment::create($data);
    }

    /**
     * Update assignment (hanya is_active).
     */
    public function updateAssignment(int $id, array $data): TeacherSubjectAssignment
    {
        $assignment = TeacherSubjectAssignment::findOrFail($id);
        $assignment->update($data);
        return $assignment->load(['teacherProfile.user', 'classSubject.schoolClass', 'classSubject.subject', 'academicYear']);
    }

    /**
     * Delete/soft delete assignment.
     */
    public function deleteAssignment(int $id): bool
    {
        $assignment = TeacherSubjectAssignment::findOrFail($id);
        return $assignment->delete();
    }

    /**
     * Get subjects taught by teacher.
     */
    public function getSubjectsByTeacher(int $teacherProfileId, ?int $academicYearId = null): Collection
    {
        $query = TeacherSubjectAssignment::whereHas('classSubject', function ($q) {
            $q->where('is_active', true);
        })
            ->where('teacher_profile_id', $teacherProfileId)
            ->where('is_active', true);

        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }

        $assignments = $query->with('classSubject.subject')->get();

        // Extract unique subjects
        $subjects = collect();
        foreach ($assignments as $assignment) {
            $subject = $assignment->classSubject->subject;
            if (!$subjects->contains('id', $subject->id)) {
                $subjects->push($subject);
            }
        }

        return $subjects;
    }

    /**
     * Get classes taught by teacher.
     */
    public function getClassesByTeacher(int $teacherProfileId, ?int $academicYearId = null): Collection
    {
        $query = TeacherSubjectAssignment::whereHas('classSubject', function ($q) {
            $q->where('is_active', true);
        })
            ->where('teacher_profile_id', $teacherProfileId)
            ->where('is_active', true);

        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }

        $assignments = $query->with('classSubject.schoolClass')->get();

        // Extract unique classes
        $classes = collect();
        foreach ($assignments as $assignment) {
            $class = $assignment->classSubject->schoolClass;
            if (!$classes->contains('id', $class->id)) {
                $classes->push($class);
            }
        }

        return $classes;
    }

    /**
     * Assign teacher to class-subject.
     */
    public function assignTeacherToClassSubject(
        int $teacherProfileId,
        int $classSubjectId,
        int $academicYearId
    ): TeacherSubjectAssignment {
        return $this->createAssignment([
            'teacher_profile_id' => $teacherProfileId,
            'class_subject_id' => $classSubjectId,
            'academic_year_id' => $academicYearId,
            'is_active' => true,
        ]);
    }

    /**
     * Remove teacher from class-subject.
     */
    public function removeTeacherFromClassSubject(
        int $teacherProfileId,
        int $classSubjectId,
        int $academicYearId
    ): bool {
        $assignment = TeacherSubjectAssignment::where('teacher_profile_id', $teacherProfileId)
            ->where('class_subject_id', $classSubjectId)
            ->where('academic_year_id', $academicYearId)
            ->firstOrFail();

        return $assignment->delete();
    }
}
