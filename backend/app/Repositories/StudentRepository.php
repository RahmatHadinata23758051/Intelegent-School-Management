<?php

namespace App\Repositories;

use App\Models\Student;

class StudentRepository
{
    private function getRiskLevelAliases(string $riskLevel): array
    {
        return match (strtolower(trim($riskLevel))) {
            'high', 'high risk' => ['high', 'High Risk'],
            'medium', 'warning' => ['medium', 'Warning'],
            default => ['low', 'Safe'],
        };
    }

    public function findById(int $id): ?Student
    {
        return Student::with('riskScore', 'grades', 'violations', 'class')->find($id);
    }

    public function findByRiskLevel(string $riskLevel, int $limit = 20)
    {
        $riskLevels = $this->getRiskLevelAliases($riskLevel);

        return Student::whereHas('riskScore', function ($query) use ($riskLevels) {
            $query->whereIn('risk_level', $riskLevels);
        })
            ->with('riskScore', 'class')
            ->limit($limit)
            ->get();
    }

    public function findByClass(int $classId)
    {
        return Student::where('class_id', $classId)
            ->with('riskScore')
            ->get();
    }

    public function getAll($limit = 100)
    {
        return Student::with('riskScore', 'class')
            ->limit($limit)
            ->get();
    }

    public function create(array $data): Student
    {
        return Student::create($data);
    }

    public function update(Student $student, array $data): Student
    {
        $student->update($data);
        return $student;
    }

    public function delete(Student $student): bool
    {
        return $student->delete();
    }
}
