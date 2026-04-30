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
        'class_id',
        'risk_score',
    ];

    protected $casts = [
        'risk_score' => 'float',
    ];

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function violations()
    {
        return $this->hasMany(Violation::class);
    }

    public function riskScore()
    {
        return $this->hasOne(RiskScore::class);
    }

    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}
