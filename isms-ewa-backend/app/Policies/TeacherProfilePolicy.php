<?php

namespace App\Policies;

use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TeacherProfilePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Semua user bisa list
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TeacherProfile $teacherProfile): bool
    {
        return true; // Semua user bisa view detail
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
    public function update(User $user, TeacherProfile $teacherProfile): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TeacherProfile $teacherProfile): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TeacherProfile $teacherProfile): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TeacherProfile $teacherProfile): bool
    {
        return $user->role === 'admin';
    }
}
