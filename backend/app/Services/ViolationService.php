<?php

namespace App\Services;

use App\Models\Violation;
use App\Models\Student;

class ViolationService
{
    private ScoringService $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    public function createViolation(array $data): Violation
    {
        $violation = Violation::create($data);

        $student = $violation->student;
        $this->scoringService->updateStudentRiskScore($student);

        return $violation;
    }

    public function updateViolation(Violation $violation, array $data): Violation
    {
        $violation->update($data);

        $student = $violation->student;
        $this->scoringService->updateStudentRiskScore($student);

        return $violation;
    }

    public function deleteViolation(Violation $violation): bool
    {
        $student = $violation->student;

        $violation->delete();

        $this->scoringService->updateStudentRiskScore($student);

        return true;
    }

    public function getStudentViolations(Student $student)
    {
        return $student->violations()->orderBy('created_at', 'desc')->get();
    }
}
