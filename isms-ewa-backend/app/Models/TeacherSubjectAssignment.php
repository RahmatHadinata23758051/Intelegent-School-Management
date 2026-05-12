<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherSubjectAssignment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_profile_id',
        'class_subject_id',
        'academic_year_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    /**
     * Get the teacher profile associated with this assignment.
     */
    public function teacherProfile(): BelongsTo
    {
        return $this->belongsTo(TeacherProfile::class);
    }

    /**
     * Get the class subject associated with this assignment.
     */
    public function classSubject(): BelongsTo
    {
        return $this->belongsTo(ClassSubject::class);
    }

    /**
     * Get the academic year associated with this assignment.
     */
    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Get weekly grades for this assignment.
     */
    public function weeklyGrades()
    {
        return $this->hasMany(WeeklyGrade::class);
    }

    // ===== SCOPES =====

    /**
     * Filter active assignments.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Filter by teacher profile.
     */
    public function scopeByTeacher($query, $teacherProfileId)
    {
        return $query->where('teacher_profile_id', $teacherProfileId);
    }

    /**
     * Filter by class subject.
     */
    public function scopeByClassSubject($query, $classSubjectId)
    {
        return $query->where('class_subject_id', $classSubjectId);
    }

    /**
     * Filter by academic year.
     */
    public function scopeByAcademicYear($query, $academicYearId)
    {
        return $query->where('academic_year_id', $academicYearId);
    }

    /**
     * Filter by school class.
     */
    public function scopeByClass($query, $schoolClassId)
    {
        return $query->whereHas('classSubject', function ($q) use ($schoolClassId) {
            $q->where('school_class_id', $schoolClassId);
        });
    }

    /**
     * Filter by subject.
     */
    public function scopeBySubject($query, $subjectId)
    {
        return $query->whereHas('classSubject', function ($q) use ($subjectId) {
            $q->where('subject_id', $subjectId);
        });
    }

    /**
     * Filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        if ($status === 'active') {
            return $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            return $query->where('is_active', false);
        }
        return $query;
    }

    /**
     * Search by teacher name, email, NIP, class name, subject code, subject name.
     */
    public function scopeSearch($query, $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            // Search by teacher name (from user)
            $q->whereHas('teacherProfile.user', function ($subQ) use ($search) {
                $subQ->where('name', 'like', "%{$search}%");
            })
            // Search by teacher email
            ->orWhereHas('teacherProfile.user', function ($subQ) use ($search) {
                $subQ->where('email', 'like', "%{$search}%");
            })
            // Search by teacher NIP
            ->orWhereHas('teacherProfile', function ($subQ) use ($search) {
                $subQ->where('nip', 'like', "%{$search}%");
            })
            // Search by class name
            ->orWhereHas('classSubject.schoolClass', function ($subQ) use ($search) {
                $subQ->where('name', 'like', "%{$search}%");
            })
            // Search by subject code
            ->orWhereHas('classSubject.subject', function ($subQ) use ($search) {
                $subQ->where('code', 'like', "%{$search}%");
            })
            // Search by subject name
            ->orWhereHas('classSubject.subject', function ($subQ) use ($search) {
                $subQ->where('name', 'like', "%{$search}%");
            });
        });
    }
}
