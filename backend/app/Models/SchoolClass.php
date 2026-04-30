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

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function homeRoomTeacher()
    {
        return $this->belongsTo(User::class, 'homeroom_teacher_id');
    }
}
