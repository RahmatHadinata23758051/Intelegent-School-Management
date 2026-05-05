<?php

namespace App\Services;

use App\Models\RiskScore;
use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;

class StudentService
{
    private ScoringService $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    public function getAllStudents(): Collection
    {
        return Student::query()
            ->with(['riskScore', 'class'])
            ->orderBy('name')
            ->get();
    }

    public function createStudent(array $data): Student
    {
        $student = Student::create($data);

        $this->scoringService->updateStudentRiskScore($student);

        return $student->load(['riskScore', 'class']);
    }

    public function updateStudent(Student $student, array $data): Student
    {
        $student->update($data);

        $this->scoringService->updateStudentRiskScore($student);

        return $student->load(['riskScore', 'class']);
    }

    public function getStudentWithRiskInfo(Student $student): Student
    {
        return $student->load(['riskScore', 'grades', 'violations', 'class']);
    }

    public function getStudentsByRiskLevel(string $riskLevel, int $limit = 20): Collection
    {
        $riskLevels = $this->scoringService->getRiskLevelAliases($riskLevel);

        return Student::query()
            ->whereHas('riskScore', function ($query) use ($riskLevels) {
                $query->whereIn('risk_level', $riskLevels);
            })
            ->with(['riskScore', 'class'])
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    public function getStudentStatistics(): array
    {
        $studentCount = Student::query()->count();

        $riskAggregates = RiskScore::query()
            ->selectRaw('COALESCE(AVG(total_score), 0) as average_risk_score')
            ->selectRaw("SUM(CASE WHEN LOWER(risk_level) IN ('high', 'high risk') THEN 1 ELSE 0 END) as high_count")
            ->selectRaw("SUM(CASE WHEN LOWER(risk_level) IN ('medium', 'warning') THEN 1 ELSE 0 END) as medium_count")
            ->selectRaw("SUM(CASE WHEN LOWER(risk_level) IN ('low', 'safe') THEN 1 ELSE 0 END) as low_count")
            ->first();

        return [
            'totalStudents' => $studentCount,
            'averageRiskScore' => round((float) ($riskAggregates?->average_risk_score ?? 0), 1),
            'riskStats' => [
                'low' => (int) ($riskAggregates?->low_count ?? 0),
                'medium' => (int) ($riskAggregates?->medium_count ?? 0),
                'high' => (int) ($riskAggregates?->high_count ?? 0),
            ],
        ];
    }

    public function deleteStudent(Student $student): bool
    {
        return $student->delete();
    }
}
