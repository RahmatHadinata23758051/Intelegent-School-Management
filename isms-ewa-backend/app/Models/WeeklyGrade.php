<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WeeklyGrade extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'teacher_subject_assignment_id',
        'grade_component_id',
        'academic_year_id',
        'semester_id',
        'week_number',
        'assessment_date',
        'score',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'week_number' => 'integer',
        'assessment_date' => 'date',
        'score' => 'decimal:2',
    ];

    /**
     * Relationship: Weekly grade belongs to student
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relationship: Weekly grade belongs to teacher subject assignment
     */
    public function teacherSubjectAssignment()
    {
        return $this->belongsTo(TeacherSubjectAssignment::class);
    }

    /**
     * Relationship: Weekly grade belongs to grade component
     */
    public function gradeComponent()
    {
        return $this->belongsTo(GradeComponent::class);
    }

    /**
     * Relationship: Weekly grade belongs to academic year
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Relationship: Weekly grade belongs to semester
     */
    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    /**
     * Relationship: Weekly grade recorded by user
     */
    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Scope: Filter by student
     */
    public function scopeByStudent($query, $studentId)
    {
        if (empty($studentId)) {
            return $query;
        }
        return $query->where('student_id', $studentId);
    }

    /**
     * Scope: Filter by teacher subject assignment
     */
    public function scopeByTeacherAssignment($query, $assignmentId)
    {
        if (empty($assignmentId)) {
            return $query;
        }
        return $query->where('teacher_subject_assignment_id', $assignmentId);
    }

    /**
     * Scope: Filter by class (through teacher subject assignment)
     */
    public function scopeByClass($query, $classId)
    {
        if (empty($classId)) {
            return $query;
        }
        return $query->whereHas('teacherSubjectAssignment', function ($q) use ($classId) {
            $q->whereHas('classSubject', function ($q2) use ($classId) {
                $q2->where('school_class_id', $classId);
            });
        });
    }

    /**
     * Scope: Filter by subject (through teacher subject assignment)
     */
    public function scopeBySubject($query, $subjectId)
    {
        if (empty($subjectId)) {
            return $query;
        }
        return $query->whereHas('teacherSubjectAssignment', function ($q) use ($subjectId) {
            $q->whereHas('classSubject', function ($q2) use ($subjectId) {
                $q2->where('subject_id', $subjectId);
            });
        });
    }

    /**
     * Scope: Filter by teacher (through teacher subject assignment)
     */
    public function scopeByTeacher($query, $teacherProfileId)
    {
        if (empty($teacherProfileId)) {
            return $query;
        }
        return $query->whereHas('teacherSubjectAssignment', function ($q) use ($teacherProfileId) {
            $q->where('teacher_profile_id', $teacherProfileId);
        });
    }

    /**
     * Scope: Filter by academic year
     */
    public function scopeByAcademicYear($query, $academicYearId)
    {
        if (empty($academicYearId)) {
            return $query;
        }
        return $query->where('academic_year_id', $academicYearId);
    }

    /**
     * Scope: Filter by semester
     */
    public function scopeBySemester($query, $semesterId)
    {
        if (empty($semesterId)) {
            return $query;
        }
        return $query->where('semester_id', $semesterId);
    }

    /**
     * Scope: Filter by grade component
     */
    public function scopeByGradeComponent($query, $componentId)
    {
        if (empty($componentId)) {
            return $query;
        }
        return $query->where('grade_component_id', $componentId);
    }

    /**
     * Scope: Filter by week number
     */
    public function scopeByWeek($query, $weekNumber)
    {
        if (empty($weekNumber)) {
            return $query;
        }
        return $query->where('week_number', $weekNumber);
    }

    /**
     * Scope: Filter by date range
     */
    public function scopeByDateRange($query, $from, $to)
    {
        if (!empty($from) && !empty($to)) {
            return $query->whereBetween('assessment_date', [$from, $to]);
        } elseif (!empty($from)) {
            return $query->where('assessment_date', '>=', $from);
        } elseif (!empty($to)) {
            return $query->where('assessment_date', '<=', $to);
        }
        return $query;
    }

    /**
     * Scope: Filter by score range
     */
    public function scopeByScoreRange($query, $minScore, $maxScore)
    {
        if (!empty($minScore) && !empty($maxScore)) {
            return $query->whereBetween('score', [$minScore, $maxScore]);
        } elseif (!empty($minScore)) {
            return $query->where('score', '>=', $minScore);
        } elseif (!empty($maxScore)) {
            return $query->where('score', '<=', $maxScore);
        }
        return $query;
    }
}
