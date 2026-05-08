<?php

namespace App\Services;

use App\Models\TeacherProfile;
use App\Models\User;
use Exception;

class TeacherProfileService
{
    /**
     * Validasi bahwa user memiliki role yang tepat untuk teacher profile
     */
    public function validateUserRole($userId)
    {
        $user = User::find($userId);
        if (!$user || !$user->canHaveTeacherProfile()) {
            throw new Exception('User harus memiliki role teacher atau homeroom_teacher');
        }
    }

    /**
     * Buat teacher profile baru
     */
    public function createProfile(array $data)
    {
        $this->validateUserRole($data['user_id']);
        return TeacherProfile::create($data);
    }

    /**
     * Update teacher profile
     */
    public function updateProfile(TeacherProfile $profile, array $data)
    {
        return $profile->update($data);
    }

    /**
     * Deactivate teacher profile
     */
    public function deactivateProfile(TeacherProfile $profile)
    {
        return $profile->update(['is_active' => false]);
    }

    /**
     * Get dropdown list guru aktif
     */
    public function getDropdownList()
    {
        return TeacherProfile::active()
            ->with('user')
            ->get();
    }

    /**
     * Get user candidates untuk create teacher profile
     */
    public function getUserCandidates()
    {
        return User::where(function ($query) {
            $query->where('role', 'teacher')
                ->orWhere('role', 'homeroom_teacher');
        })
        ->whereDoesntHave('teacherProfile')
        ->get();
    }
}
