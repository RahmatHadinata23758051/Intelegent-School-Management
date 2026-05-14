<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory;

    protected $table = 'school_classes';

    protected $fillable = [
        'name',
        'grade_level',
        'homeroom_teacher_id',
    ];

    /**
     * Relasi: Wali kelas (User)
     */
    public function homeroomTeacher()
    {
        return $this->belongsTo(User::class, 'homeroom_teacher_id');
    }

    /**
     * Relasi: Siswa dalam kelas
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'school_class_id');
    }

    /**
     * Relasi: Mata pelajaran dalam kelas
     */
    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class, 'school_class_id');
    }

    /**
     * Relasi: Mata pelajaran melalui class_subjects
     */
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subjects', 'school_class_id', 'subject_id')
            ->withTimestamps()
            ->withPivot('is_active')
            ->wherePivot('deleted_at', null);
    }

    /**
     * Relasi: Sesi absensi kelas
     */
    public function attendanceSessions()
    {
        return $this->hasMany(AttendanceSession::class, 'school_class_id');
    }

    /**
     * Relasi: Rekap akademik kelas
     */
    public function academicSummaries()
    {
        return $this->hasMany(StudentAcademicSummary::class, 'school_class_id');
    }

    /**
     * Relasi: Raport kelas
     */
    public function reportCards()
    {
        return $this->hasMany(ReportCard::class, 'school_class_id');
    }
}
