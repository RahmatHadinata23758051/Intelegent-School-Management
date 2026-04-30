<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'description',
        'severity',
        'reported_by',
        'reported_date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($violation) {
            event(new \App\Events\ViolationCreated($violation));
        });

        static::updated(function ($violation) {
            event(new \App\Events\ViolationUpdated($violation));
        });
    }
}
