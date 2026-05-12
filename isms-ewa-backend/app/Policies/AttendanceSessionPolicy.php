<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\AttendanceSession;
use App\Models\User;

class AttendanceSessionPolicy
{
    /**
     * Determine if the user can view any attendance sessions
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER, UserRole::HOMEROOM_TEACHER]);
    }

    /**
     * Determine if the user can view the attendance session
     */
    public function view(User $user, AttendanceSession $attendanceSession): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER, UserRole::HOMEROOM_TEACHER]);
    }

    /**
     * Determine if the user can create attendance sessions
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER, UserRole::HOMEROOM_TEACHER]);
    }

    /**
     * Determine if the user can update the attendance session
     */
    public function update(User $user, AttendanceSession $attendanceSession): bool
    {
        // Admin can update any session
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher/Homeroom can update if they created it and it's not locked
        if (in_array($user->role, [UserRole::TEACHER, UserRole::HOMEROOM_TEACHER])) {
            return $attendanceSession->created_by === $user->id && !$attendanceSession->is_locked;
        }

        return false;
    }

    /**
     * Determine if the user can delete the attendance session
     */
    public function delete(User $user, AttendanceSession $attendanceSession): bool
    {
        // Cannot delete locked sessions
        if ($attendanceSession->is_locked) {
            return false;
        }

        // Admin can delete any session
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher/Homeroom can delete if they created it
        if (in_array($user->role, [UserRole::TEACHER, UserRole::HOMEROOM_TEACHER])) {
            return $attendanceSession->created_by === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can unlock the attendance session
     */
    public function unlock(User $user, AttendanceSession $attendanceSession): bool
    {
        // Only admin can unlock sessions
        return $user->role === UserRole::ADMIN;
    }
}
