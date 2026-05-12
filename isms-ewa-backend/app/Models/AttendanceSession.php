<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendanceSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'school_class_id',
        'academic_year_id',
        'semester_id',
        'session_date',
        'session_type',
        'notes',
        'created_by',
        'is_locked',
    ];

    protected $casts = [
        'session_date' => 'date',
        'is_locked' => 'boolean',
    ];

    /**
     * Relationship: AttendanceSession belongs to SchoolClass
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    /**
     * Relationship: AttendanceSession belongs to AcademicYear
     */
    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    /**
     * Relationship: AttendanceSession belongs to Semester
     */
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    /**
     * Relationship: AttendanceSession belongs to User (creator)
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relationship: AttendanceSession has many Attendances
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'attendance_session_id');
    }

    /**
     * Scope: Filter by class
     */
    public function scopeByClass($query, $classId)
    {
        return $query->where('school_class_id', $classId);
    }

    /**
     * Scope: Filter by academic year
     */
    public function scopeByAcademicYear($query, $academicYearId)
    {
        return $query->where('academic_year_id', $academicYearId);
    }

    /**
     * Scope: Filter by semester
     */
    public function scopeBySemester($query, $semesterId)
    {
        return $query->where('semester_id', $semesterId);
    }

    /**
     * Scope: Filter by date
     */
    public function scopeByDate($query, $date)
    {
        return $query->whereDate('session_date', $date);
    }

    /**
     * Scope: Filter unlocked sessions
     */
    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }

    /**
     * Scope: Filter locked sessions
     */
    public function scopeLocked($query)
    {
        return $query->where('is_locked', true);
    }

    /**
     * Scope: Filter by date range
     */
    public function scopeDateRange($query, $dateFrom, $dateTo)
    {
        return $query->whereBetween('session_date', [$dateFrom, $dateTo]);
    }
}
