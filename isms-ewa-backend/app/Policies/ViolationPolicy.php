<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;

class ViolationPolicy
{
    /**
     * Determine whether the user can view any violations.
     */
    public function viewAny(User $user, Student $student): bool
    {
        // Admin dan teacher bisa melihat semua pelanggaran
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat pelanggaran siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can view the violation.
     */
    public function view(User $user, Violation $violation): bool
    {
        // Admin dan teacher bisa melihat semua pelanggaran
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat pelanggaran siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $violation->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create violations.
     */
    public function create(User $user, Student $student): bool
    {
        // Admin dan teacher bisa membuat pelanggaran
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa membuat pelanggaran untuk siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can update the violation.
     */
    public function update(User $user, Violation $violation): bool
    {
        // Admin dan teacher bisa update pelanggaran
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa update pelanggaran siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $violation->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the violation.
     */
    public function delete(User $user, Violation $violation): bool
    {
        // Admin dan teacher bisa delete pelanggaran
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa delete pelanggaran siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $violation->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }
}
