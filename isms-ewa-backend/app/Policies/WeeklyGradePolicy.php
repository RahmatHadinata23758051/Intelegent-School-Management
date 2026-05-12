<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WeeklyGrade;

class WeeklyGradePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view weekly grades
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, WeeklyGrade $weeklyGrade): bool
    {
        // Admin can view all
        if ($user->role === 'admin') {
            return true;
        }

        // Teacher can view if they own the assignment
        if ($user->role === 'teacher' || $user->role === 'homeroom_teacher') {
            $teacherProfile = $user->teacherProfile;
            if ($teacherProfile) {
                return $weeklyGrade->teacherSubjectAssignment->teacher_profile_id === $teacherProfile->id;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Admin and teachers can create weekly grades
        return in_array($user->role, ['admin', 'teacher', 'homeroom_teacher']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WeeklyGrade $weeklyGrade): bool
    {
        // Admin can update all
        if ($user->role === 'admin') {
            return true;
        }

        // Teacher can update if they own the assignment
        if ($user->role === 'teacher' || $user->role === 'homeroom_teacher') {
            $teacherProfile = $user->teacherProfile;
            if ($teacherProfile) {
                return $weeklyGrade->teacherSubjectAssignment->teacher_profile_id === $teacherProfile->id;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WeeklyGrade $weeklyGrade): bool
    {
        // Admin can delete all
        if ($user->role === 'admin') {
            return true;
        }

        // Teacher can delete if they own the assignment
        if ($user->role === 'teacher' || $user->role === 'homeroom_teacher') {
            $teacherProfile = $user->teacherProfile;
            if ($teacherProfile) {
                return $weeklyGrade->teacherSubjectAssignment->teacher_profile_id === $teacherProfile->id;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WeeklyGrade $weeklyGrade): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WeeklyGrade $weeklyGrade): bool
    {
        return $user->role === 'admin';
    }
}
