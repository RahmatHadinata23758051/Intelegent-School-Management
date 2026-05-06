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
}
