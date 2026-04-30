<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'total_score',
        'academic_score',
        'behavioral_score',
        'risk_level',
        'last_updated',
    ];

    protected $casts = [
        'total_score' => 'float',
        'academic_score' => 'float',
        'behavioral_score' => 'float',
        'last_updated' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
