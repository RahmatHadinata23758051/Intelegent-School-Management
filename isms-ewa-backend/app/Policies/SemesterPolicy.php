<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\Semester;
use App\Models\User;

class SemesterPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat daftar semester
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Semester $semester): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat detail semester
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
        // Hanya admin yang bisa membuat semester
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Semester $semester): bool
    {
        // Hanya admin yang bisa update semester
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Semester $semester): bool
    {
        // Hanya admin yang bisa delete semester
        // Tidak bisa delete semester yang sedang active
        if ($user->role !== UserRole::ADMIN) {
            return false;
        }

        return !$semester->is_active;
    }

    /**
     * Determine whether the user can activate the model.
     */
    public function activate(User $user, Semester $semester): bool
    {
        // Hanya admin yang bisa activate semester
        return $user->role === UserRole::ADMIN;
    }
}
