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

    /**
     * Relasi: Siswa yang melanggar
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relasi: Pengguna yang melaporkan
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
