<?php

namespace App\Services;

class ReportService
{
    public function generateStudentRiskReport($studentIds)
    {
        $students = \App\Models\Student::whereIn('id', $studentIds)
            ->with('riskScore', 'grades', 'violations')
            ->get();

        return $students->map(function ($student) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'student_id' => $student->student_id,
                'risk_score' => $student->riskScore ? $student->riskScore->total_score : 0,
                'risk_level' => $student->riskScore ? $student->riskScore->risk_level : 'low',
                'total_grades' => $student->grades->count(),
                'total_violations' => $student->violations->count(),
                'average_grade' => $student->grades->avg('score') ?? 0,
            ];
        });
    }

    public function generateClassRiskReport($classId)
    {
        $class = \App\Models\SchoolClass::with('students.riskScore')->find($classId);

        if (!$class) {
            return null;
        }

        $highRiskCount = $class->students
            ->filter(fn($s) => $s->riskScore?->risk_level === 'high')
            ->count();

        $mediumRiskCount = $class->students
            ->filter(fn($s) => $s->riskScore?->risk_level === 'medium')
            ->count();

        $lowRiskCount = $class->students
            ->filter(fn($s) => $s->riskScore?->risk_level === 'low')
            ->count();

        return [
            'class_name' => $class->name,
            'grade_level' => $class->grade_level,
            'total_students' => $class->students->count(),
            'high_risk_students' => $highRiskCount,
            'medium_risk_students' => $mediumRiskCount,
            'low_risk_students' => $lowRiskCount,
            'average_risk_score' => $class->students->avg(fn($s) => $s->riskScore?->total_score) ?? 0,
        ];
    }
}
