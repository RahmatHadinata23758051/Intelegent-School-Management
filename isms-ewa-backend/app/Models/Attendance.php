<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'attendance_session_id',
        'student_id',
        'status',
        'notes',
        'recorded_by',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    /**
     * Attendance status constants
     */
    const STATUS_PRESENT = 'present';
    const STATUS_SICK = 'sick';
    const STATUS_PERMITTED = 'permitted';
    const STATUS_ABSENT = 'absent';
    const STATUS_LATE = 'late';

    /**
     * Get all valid statuses
     */
    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_PRESENT,
            self::STATUS_SICK,
            self::STATUS_PERMITTED,
            self::STATUS_ABSENT,
            self::STATUS_LATE,
        ];
    }

    /**
     * Relationship: Attendance belongs to AttendanceSession
     */
    public function attendanceSession(): BelongsTo
    {
        return $this->belongsTo(AttendanceSession::class, 'attendance_session_id');
    }

    /**
     * Relationship: Attendance belongs to Student
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Relationship: Attendance belongs to User (recorder)
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Scope: Filter by student
     */
    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Filter by session
     */
    public function scopeBySession($query, $sessionId)
    {
        return $query->where('attendance_session_id', $sessionId);
    }

    /**
     * Check if status counts as present for attendance rate
     */
    public function countsAsPresent(): bool
    {
        return in_array($this->status, [
            self::STATUS_PRESENT,
            self::STATUS_PERMITTED,
            self::STATUS_LATE,
        ]);
    }
}
