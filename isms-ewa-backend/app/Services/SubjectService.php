<?php

namespace App\Services;

use App\Models\Subject;

class SubjectService
{
    /**
     * Get dropdown list of active subjects.
     */
    public function getDropdownList()
    {
        return Subject::active()
            ->orderBy('name')
            ->get();
    }

    /**
     * Create a new subject.
     */
    public function createSubject(array $data)
    {
        return Subject::create($data);
    }

    /**
     * Update an existing subject.
     */
    public function updateSubject(Subject $subject, array $data)
    {
        $subject->update($data);
        return $subject;
    }

    /**
     * Delete a subject (soft delete).
     */
    public function deleteSubject(Subject $subject)
    {
        return $subject->delete();
    }
}
