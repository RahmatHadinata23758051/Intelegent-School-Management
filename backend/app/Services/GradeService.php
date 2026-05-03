<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\Student;

class GradeService
{
    private ScoringService $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    public function createGrade(array $data): Grade
    {
        $grade = Grade::create($data);

        $student = $grade->student;
        $this->scoringService->calculateRisk($student->id);

        return $grade;
    }

    public function updateGrade(Grade $grade, array $data): Grade
    {
        $grade->update($data);

        $student = $grade->student;
        $this->scoringService->calculateRisk($student->id);

        return $grade;
    }

    public function deleteGrade(Grade $grade): bool
    {
        $student = $grade->student;

        $grade->delete();

        $this->scoringService->updateStudentRiskScore($student);

        return true;
    }

    public function getStudentGrades(Student $student)
    {
        return $student->grades()->orderBy('created_at', 'desc')->get();
    }
}
