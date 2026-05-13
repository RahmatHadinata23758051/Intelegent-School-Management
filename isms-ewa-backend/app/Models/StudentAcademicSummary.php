<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Student Academic Summary Model
 * 
 * Stores comprehensive academic performance summary for a student in a specific semester.
 * Includes academic metrics, attendance data, and violation counts.
 */
class StudentAcademicSummary extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'school_class_id',
        'academic_year_id',
        'semester_id',
        'total_subjects',
        'average_score',
        'min_score',
        'max_score',
        'low_score_count',
        'attendance_rate',
        'present_count',
        'sick_count',
        'permitted_count',
        'absent_count',
        'late_count',
        'violation_count',
        'minor_violation_count',
        'moderate_violation_count',
        'major_violation_count',
        'severe_violation_count',
        'academic_status',
        'attendance_status',
        'behavior_status',
        'overall_status',
        'generated_at',
        'generated_by',
    ];

    protected $casts = [
        'total_subjects' => 'integer',
        'average_score' => 'decimal:2',
        'min_score' => 'decimal:2',
        'max_score' => 'decimal:2',
        'low_score_count' => 'integer',
        'attendance_rate' => 'decimal:2',
        'present_count' => 'integer',
        'sick_count' => 'integer',
        'permitted_count' => 'integer',
        'absent_count' => 'integer',
        'late_count' => 'integer',
        'violation_count' => 'integer',
        'minor_violation_count' => 'integer',
        'moderate_violation_count' => 'integer',
        'major_violation_count' => 'integer',
        'severe_violation_count' => 'integer',
        'generated_at' => 'datetime',
    ];

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

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function reportCard(): HasOne
    {
        return $this->hasOne(ReportCard::class);
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

    public function scopeByAcademicStatus($query, $status)
    {
        return $query->where('academic_status', $status);
    }

    public function scopeByOverallStatus($query, $status)
    {
        return $query->where('overall_status', $status);
    }

    public function scopeWithLowScores($query)
    {
        return $query->where('low_score_count', '>', 0);
    }

    public function scopeWithPoorAttendance($query)
    {
        return $query->where('attendance_status', 'poor');
    }

    public function scopeWithViolations($query)
    {
        return $query->where('violation_count', '>', 0);
    }

    /**
     * Accessors
     */
    public function getTotalAttendanceAttribute(): int
    {
        return $this->present_count + $this->sick_count + $this->permitted_count + $this->absent_count + $this->late_count;
    }

    public function getHasCriticalIssuesAttribute(): bool
    {
        return $this->overall_status === 'critical' 
            || $this->academic_status === 'critical'
            || $this->attendance_status === 'poor'
            || $this->behavior_status === 'serious';
    }
}
