<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\AcademicYear;
use App\Models\User;

class AcademicYearPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat daftar tahun ajaran
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AcademicYear $academicYear): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat detail tahun ajaran
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Hanya admin yang bisa membuat tahun ajaran
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AcademicYear $academicYear): bool
    {
        // Hanya admin yang bisa update tahun ajaran
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AcademicYear $academicYear): bool
    {
        // Hanya admin yang bisa delete tahun ajaran
        // Tidak bisa delete tahun ajaran yang sedang active
        if ($user->role !== UserRole::ADMIN) {
            return false;
        }

        return !$academicYear->is_active;
    }

    /**
     * Determine whether the user can activate the model.
     */
    public function activate(User $user, AcademicYear $academicYear): bool
    {
        // Hanya admin yang bisa activate tahun ajaran
        return $user->role === UserRole::ADMIN;
    }
}
