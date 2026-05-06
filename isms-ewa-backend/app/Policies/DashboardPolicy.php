<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\User;

class DashboardPolicy
{
    /**
     * Determine whether the user can view dashboard statistics.
     */
    public function viewStatistics(User $user): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat dashboard
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }
}
