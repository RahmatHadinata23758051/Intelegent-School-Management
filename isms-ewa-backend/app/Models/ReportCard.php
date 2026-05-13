<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Report Card Model
 * 
 * Stores report card preview data with JSON snapshots for historical preservation.
 * Supports workflow: draft -> generated -> reviewed -> approved
 */
class ReportCard extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'school_class_id',
        'academic_year_id',
        'semester_id',
        'student_academic_summary_id',
        'report_number',
        'status',
        'subject_grades',
        'attendance_summary',
        'violation_summary',
        'academic_summary',
        'notes',
        'homeroom_notes',
        'generated_at',
        'reviewed_at',
        'approved_at',
        'generated_by',
        'reviewed_by',
        'approved_by',
    ];

    protected $casts = [
        'subject_grades' => 'array',
        'attendance_summary' => 'array',
        'violation_summary' => 'array',
        'academic_summary' => 'array',
        'generated_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Status constants
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_GENERATED = 'generated';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_APPROVED = 'approved';

    /**
     * Relationships
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function studentAcademicSummary(): BelongsTo
    {
        return $this->belongsTo(StudentAcademicSummary::class);
    }

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scopes
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeForClass($query, $schoolClassId)
    {
        return $query->where('school_class_id', $schoolClassId);
    }

    public function scopeForAcademicYear($query, $academicYearId)
    {
        return $query->where('academic_year_id', $academicYearId);
    }

    public function scopeForSemester($query, $semesterId)
    {
        return $query->where('semester_id', $semesterId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    public function scopeGenerated($query)
    {
        return $query->where('status', self::STATUS_GENERATED);
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', self::STATUS_REVIEWED);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Accessors
     */
    public function getIsDraftAttribute(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function getIsGeneratedAttribute(): bool
    {
        return $this->status === self::STATUS_GENERATED;
    }

    public function getIsReviewedAttribute(): bool
    {
        return $this->status === self::STATUS_REVIEWED;
    }

    public function getIsApprovedAttribute(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function getCanBeEditedAttribute(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_GENERATED]);
    }

    public function getCanBeApprovedAttribute(): bool
    {
        return in_array($this->status, [self::STATUS_GENERATED, self::STATUS_REVIEWED]);
    }
}
