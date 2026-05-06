<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\Grade;
use App\Models\Student;
use App\Models\User;

class GradePolicy
{
    /**
     * Determine whether the user can view any grades.
     */
    public function viewAny(User $user, Student $student): bool
    {
        // Admin dan teacher bisa melihat semua nilai
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat nilai siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can view the grade.
     */
    public function view(User $user, Grade $grade): bool
    {
        // Admin dan teacher bisa melihat semua nilai
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat nilai siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $grade->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create grades.
     */
    public function create(User $user, Student $student): bool
    {
        // Admin dan teacher bisa membuat nilai
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa membuat nilai untuk siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can update the grade.
     */
    public function update(User $user, Grade $grade): bool
    {
        // Admin dan teacher bisa update nilai
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa update nilai siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $grade->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the grade.
     */
    public function delete(User $user, Grade $grade): bool
    {
        // Admin dan teacher bisa delete nilai
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa delete nilai siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $grade->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }
}
