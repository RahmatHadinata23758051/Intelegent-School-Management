<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\User;
use App\Models\StudentAcademicSummary;

class StudentAcademicSummaryPolicy
{
    /**
     * Determine if the user can view any academic summaries.
     */
    public function viewAny(User $user): bool
    {
        // Admin can view all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teachers and teachers can view summaries
        if (in_array($user->role, [UserRole::HOMEROOM_TEACHER, UserRole::TEACHER])) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine if the user can view the academic summary.
     */
    public function view(User $user, StudentAcademicSummary $summary): bool
    {
        // Admin can view all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teacher can view summaries for their class
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            $homeroomClass = $user->teacherProfile?->homeroomClass;
            return $homeroomClass && $summary->school_class_id === $homeroomClass->id;
        }
        
        // Teacher can view summaries for students in classes they teach
        if ($user->role === UserRole::TEACHER) {
            $teacherProfile = $user->teacherProfile;
            if (!$teacherProfile) {
                return false;
            }
            
            // Check if teacher has assignments in the student's class
            $hasAssignment = $teacherProfile->teacherSubjectAssignments()
                ->whereHas('classSubject', function ($query) use ($summary) {
                    $query->where('school_class_id', $summary->school_class_id);
                })
                ->exists();
            
            return $hasAssignment;
        }
        
        return false;
    }

    /**
     * Determine if the user can create academic summaries.
     */
    public function create(User $user): bool
    {
        // Admin can create
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teachers can create for their class
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            return $user->teacherProfile?->homeroomClass !== null;
        }
        
        return false;
    }

    /**
     * Determine if the user can update the academic summary.
     */
    public function update(User $user, StudentAcademicSummary $summary): bool
    {
        // Admin can update all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teacher can update summaries for their class
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            $homeroomClass = $user->teacherProfile?->homeroomClass;
            return $homeroomClass && $summary->school_class_id === $homeroomClass->id;
        }
        
        return false;
    }

    /**
     * Determine if the user can delete the academic summary.
     */
    public function delete(User $user, StudentAcademicSummary $summary): bool
    {
        // Only admin can delete
        return $user->role === UserRole::ADMIN;
    }
}
