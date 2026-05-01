<?php

namespace App\Utilities;

class ValidationRules
{
    public static function studentRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'student_id' => 'required|string|unique:students|max:50',
            'class_id' => 'required|exists:school_classes,id',
        ];
    }

    public static function gradeRules(): array
    {
        return [
            'subject' => 'required|string|max:255',
            'score' => 'required|numeric|min:0|max:100',
            'semester' => 'required|string|in:1,2',
            'academic_year' => 'required|string|regex:/^\d{4}$/',
        ];
    }

    public static function violationRules(): array
    {
        return [
            'description' => 'required|string|max:1000',
            'severity' => 'required|string|in:minor,moderate,major,severe',
            'reported_by' => 'required|string|max:255',
            'reported_date' => 'required|date',
        ];
    }

    public static function classRules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:school_classes',
            'grade_level' => 'required|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ];
    }
}
