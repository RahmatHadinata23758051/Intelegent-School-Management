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

    protected $casts = [
        'score' => 'float',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($grade) {
            event(new \App\Events\GradeCreated($grade));
        });

        static::updated(function ($grade) {
            event(new \App\Events\GradeUpdated($grade));
        });
    }
}
