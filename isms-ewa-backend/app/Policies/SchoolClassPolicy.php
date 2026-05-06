<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\SchoolClass;
use App\Models\User;

class SchoolClassPolicy
{
    /**
     * Determine whether the user can view any school classes.
     */
    public function viewAny(User $user): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat daftar kelas
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }

    /**
     * Determine whether the user can view the school class.
     */
    public function view(User $user, SchoolClass $schoolClass): bool
    {
        // Admin dan teacher bisa melihat semua kelas
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat kelas yang dia wali
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create school classes.
     */
    public function create(User $user): bool
    {
        // Hanya admin yang bisa membuat kelas
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can update the school class.
     */
    public function update(User $user, SchoolClass $schoolClass): bool
    {
        // Hanya admin yang bisa update kelas
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can delete the school class.
     */
    public function delete(User $user, SchoolClass $schoolClass): bool
    {
        // Hanya admin yang bisa delete kelas
        return $user->role === UserRole::ADMIN;
    }
}
