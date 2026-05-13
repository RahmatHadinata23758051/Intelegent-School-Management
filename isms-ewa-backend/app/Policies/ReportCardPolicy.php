<?php

namespace App\Policies;

use App\Constants\UserRole;
use App\Models\User;
use App\Models\ReportCard;

class ReportCardPolicy
{
    /**
     * Determine if the user can view any report cards.
     */
    public function viewAny(User $user): bool
    {
        // Admin can view all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teachers and teachers can view report cards
        if (in_array($user->role, [UserRole::HOMEROOM_TEACHER, UserRole::TEACHER])) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine if the user can view the report card.
     */
    public function view(User $user, ReportCard $reportCard): bool
    {
        // Admin can view all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teacher can view report cards for their class
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            $homeroomClass = $user->teacherProfile?->homeroomClass;
            return $homeroomClass && $reportCard->school_class_id === $homeroomClass->id;
        }
        
        // Teacher can view report cards for students in classes they teach
        if ($user->role === UserRole::TEACHER) {
            $teacherProfile = $user->teacherProfile;
            if (!$teacherProfile) {
                return false;
            }
            
            // Check if teacher has assignments in the student's class
            $hasAssignment = $teacherProfile->teacherSubjectAssignments()
                ->whereHas('classSubject', function ($query) use ($reportCard) {
                    $query->where('school_class_id', $reportCard->school_class_id);
                })
                ->exists();
            
            return $hasAssignment;
        }
        
        return false;
    }

    /**
     * Determine if the user can create report cards.
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
     * Determine if the user can update the report card.
     */
    public function update(User $user, ReportCard $reportCard): bool
    {
        // Admin can update all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teacher can update report cards for their class
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            $homeroomClass = $user->teacherProfile?->homeroomClass;
            return $homeroomClass && $reportCard->school_class_id === $homeroomClass->id;
        }
        
        return false;
    }

    /**
     * Determine if the user can approve the report card.
     */
    public function approve(User $user, ReportCard $reportCard): bool
    {
        // Admin can approve all
        if ($user->role === UserRole::ADMIN) {
            return true;
        }
        
        // Homeroom teacher can approve report cards for their class
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            $homeroomClass = $user->teacherProfile?->homeroomClass;
            return $homeroomClass && $reportCard->school_class_id === $homeroomClass->id;
        }
        
        return false;
    }

    /**
     * Determine if the user can delete the report card.
     */
    public function delete(User $user, ReportCard $reportCard): bool
    {
        // Only admin can delete
        return $user->role === UserRole::ADMIN;
    }
}
