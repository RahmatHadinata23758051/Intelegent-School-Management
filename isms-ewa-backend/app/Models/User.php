<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Relasi: Wali kelas untuk kelas-kelas
     */
    public function homeroomClasses()
    {
        return $this->hasMany(SchoolClass::class, 'homeroom_teacher_id');
    }

    /**
     * Relasi: Pelanggaran yang dilaporkan
     */
    public function reportedViolations()
    {
        return $this->hasMany(Violation::class, 'reported_by');
    }

    /**
     * Relasi: Profil guru
     */
    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    /**
     * Helper: Cek apakah user adalah guru
     */
    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    /**
     * Helper: Cek apakah user adalah wali kelas
     */
    public function isHomeroomTeacher()
    {
        return $this->role === 'homeroom_teacher';
    }

    /**
     * Helper: Cek apakah user bisa punya teacher profile
     */
    public function canHaveTeacherProfile()
    {
        return $this->isTeacher() || $this->isHomeroomTeacher();
    }
}
