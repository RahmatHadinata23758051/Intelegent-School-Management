<?php

namespace App\Services;

use App\Models\Student;

class StudentService
{
    private ScoringService $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    public function createStudent(array $data): Student
    {
        $student = Student::create($data);

        $this->scoringService->updateStudentRiskScore($student);

        return $student->load('riskScore');
    }

    public function updateStudent(Student $student, array $data): Student
    {
        $student->update($data);

        $this->scoringService->updateStudentRiskScore($student);

        return $student->load('riskScore');
    }

    public function getStudentWithRiskInfo(Student $student): Student
    {
        return $student->load('riskScore', 'grades', 'violations', 'class');
    }

    public function getStudentsByRiskLevel(string $riskLevel, $limit = 20)
    {
        return Student::whereHas('riskScore', function ($query) use ($riskLevel) {
            $query->where('risk_level', $riskLevel);
        })
        ->with('riskScore', 'class')
        ->limit($limit)
        ->get();
    }
}
