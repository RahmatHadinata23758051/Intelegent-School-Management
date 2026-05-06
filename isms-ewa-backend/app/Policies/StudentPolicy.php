<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    /**
     * Determine whether the user can view any students.
     */
    public function viewAny(User $user): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat daftar siswa
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }

    /**
     * Determine whether the user can view the student.
     */
    public function view(User $user, Student $student): bool
    {
        // Admin dan teacher bisa melihat semua siswa
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat siswa di kelas yang dia wali
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create students.
     */
    public function create(User $user): bool
    {
        // Hanya admin yang bisa membuat siswa
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can update the student.
     */
    public function update(User $user, Student $student): bool
    {
        // Admin bisa update semua siswa
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher bisa update semua siswa
        if ($user->role === UserRole::TEACHER) {
            return true;
        }

        // Homeroom teacher hanya bisa update siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the student.
     */
    public function delete(User $user, Student $student): bool
    {
        // Hanya admin yang bisa delete siswa
        return $user->role === UserRole::ADMIN;
    }
}
