<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'student_id',
        'school_class_id',
    ];

    /**
     * Relasi: Kelas siswa
     */
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    /**
     * Relasi: Nilai siswa
     */
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    /**
     * Relasi: Pelanggaran siswa
     */
    public function violations()
    {
        return $this->hasMany(Violation::class);
    }

    /**
     * Relasi: Skor risiko siswa
     */
    public function riskScore()
    {
        return $this->hasOne(RiskScore::class);
    }

    /**
     * Relasi: Absensi siswa
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    /**
     * Relasi: Nilai mingguan siswa
     */
    public function weeklyGrades()
    {
        return $this->hasMany(WeeklyGrade::class);
    }

    /**
     * Relasi: Rekap akademik siswa
     */
    public function academicSummaries()
    {
        return $this->hasMany(StudentAcademicSummary::class);
    }

    /**
     * Relasi: Raport siswa
     */
    public function reportCards()
    {
        return $this->hasMany(ReportCard::class);
    }
}
