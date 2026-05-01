<?php

namespace App\Repositories;

use App\Models\Student;

class StudentRepository
{
    public function findById(int $id): ?Student
    {
        return Student::with('riskScore', 'grades', 'violations', 'class')->find($id);
    }

    public function findByRiskLevel(string $riskLevel, int $limit = 20)
    {
        return Student::whereHas('riskScore', function ($query) use ($riskLevel) {
            $query->where('risk_level', $riskLevel);
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
