<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    /**
     * Determine if the user can view any attendances
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER, UserRole::HOMEROOM_TEACHER]);
    }

    /**
     * Determine if the user can view the attendance
     */
    public function view(User $user, Attendance $attendance): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER, UserRole::HOMEROOM_TEACHER]);
    }

    /**
     * Determine if the user can create attendances
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER, UserRole::HOMEROOM_TEACHER]);
    }

    /**
     * Determine if the user can update the attendance
     */
    public function update(User $user, Attendance $attendance): bool
    {
        // Cannot update if session is locked
        if ($attendance->attendanceSession && $attendance->attendanceSession->is_locked) {
            return false;
        }

        // Admin can update any attendance
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher/Homeroom can update if they recorded it
        if (in_array($user->role, [UserRole::TEACHER, UserRole::HOMEROOM_TEACHER])) {
            return $attendance->recorded_by === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can delete the attendance
     */
    public function delete(User $user, Attendance $attendance): bool
    {
        // Cannot delete if session is locked
        if ($attendance->attendanceSession && $attendance->attendanceSession->is_locked) {
            return false;
        }

        // Admin can delete any attendance
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher/Homeroom can delete if they recorded it
        if (in_array($user->role, [UserRole::TEACHER, UserRole::HOMEROOM_TEACHER])) {
            return $attendance->recorded_by === $user->id;
        }

        return false;
    }
}
