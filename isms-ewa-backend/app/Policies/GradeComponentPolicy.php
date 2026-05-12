<?php

namespace App\Policies;

use App\Models\GradeComponent;
use App\Models\User;

class GradeComponentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view grade components
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, GradeComponent $gradeComponent): bool
    {
        // All authenticated users can view grade component details
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admin can create grade components
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, GradeComponent $gradeComponent): bool
    {
        // Only admin can update grade components
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, GradeComponent $gradeComponent): bool
    {
        // Only admin can delete grade components
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, GradeComponent $gradeComponent): bool
    {
        // Only admin can restore grade components
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, GradeComponent $gradeComponent): bool
    {
        // Only admin can force delete grade components
        return $user->role === 'admin';
    }
}
