<?php

namespace App\Policies;

use App\Models\TeacherSubjectAssignment;
use App\Models\User;

class TeacherSubjectAssignmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'homeroom_teacher']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TeacherSubjectAssignment $assignment): bool
    {
        // Admin bisa view semua
        if ($user->role === 'admin') {
            return true;
        }

        // Teacher/Homeroom bisa view assignment dirinya sendiri
        if (in_array($user->role, ['teacher', 'homeroom_teacher'])) {
            return $user->teacherProfile && $user->teacherProfile->id === $assignment->teacher_profile_id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TeacherSubjectAssignment $assignment): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TeacherSubjectAssignment $assignment): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TeacherSubjectAssignment $assignment): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TeacherSubjectAssignment $assignment): bool
    {
        return $user->role === 'admin';
    }
}
