<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\RiskScore;
use App\Models\Student;
use App\Models\User;

class RiskScorePolicy
{
    /**
     * Determine whether the user can view any risk scores.
     */
    public function viewAny(User $user): bool
    {
        // Admin, teacher, dan homeroom_teacher bisa melihat daftar risk score
        return in_array($user->role, [
            UserRole::ADMIN,
            UserRole::TEACHER,
            UserRole::HOMEROOM_TEACHER,
        ]);
    }

    /**
     * Determine whether the user can view the risk score.
     */
    public function view(User $user, RiskScore $riskScore): bool
    {
        // Admin dan teacher bisa melihat semua risk score
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa melihat risk score siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $riskScore->student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can recalculate the risk score.
     */
    public function recalculate(User $user, Student $student): bool
    {
        // Admin dan teacher bisa recalculate semua risk score
        if (in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER])) {
            return true;
        }

        // Homeroom teacher hanya bisa recalculate risk score siswa di kelasnya
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $student->schoolClass->homeroom_teacher_id === $user->id;
        }

        return false;
    }
}
