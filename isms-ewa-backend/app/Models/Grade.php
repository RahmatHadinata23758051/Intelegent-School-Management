<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject',
        'score',
        'semester',
        'academic_year',
    ];

    /**
     * Relasi: Siswa pemilik nilai
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
