<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\Student;
use App\Models\Violation;
use App\Models\RiskScore;
use Carbon\Carbon;

class ScoringService
{
    public function updateStudentRiskScore(Student|int $student): RiskScore
    {
        $studentId = $student instanceof Student ? $student->getKey() : $student;

        return $this->calculateRisk($studentId);
    }

    public function calculateRisk(int $studentId): RiskScore
    {
        $academicScore = $this->computeAcademicRisk($studentId);
        $behavioralScore = $this->computeBehavioralRisk($studentId);

        $totalScore = min($academicScore + $behavioralScore, 100.0);
        $riskLevel = $this->determineRiskLevel($totalScore);

        return RiskScore::updateOrCreate(
            ['student_id' => $studentId],
            [
                'academic_score' => $academicScore,
                'behavioral_score' => $behavioralScore,
                'total_score' => $totalScore,
                'risk_level' => $riskLevel,
                'last_updated' => Carbon::now(),
            ]
        );
    }

    public function normalizeRiskLevel(?string $riskLevel): string
    {
        return match (strtolower(trim((string) $riskLevel))) {
            'high', 'high risk' => 'high',
            'medium', 'warning' => 'medium',
            default => 'low',
        };
    }

    public function getRiskLevelAliases(string $riskLevel): array
    {
        return match ($this->normalizeRiskLevel($riskLevel)) {
            'high' => ['high', 'High Risk'],
            'medium' => ['medium', 'Warning'],
            default => ['low', 'Safe'],
        };
    }

    private function computeAcademicRisk(int $studentId): float
    {
        $averageScore = Grade::query()
            ->where('student_id', $studentId)
            ->avg('score');

        if ($averageScore === null) {
            return 0.0;
        }

        
        if ($averageScore < 60) {
            return 45.0;
        }

        if ($averageScore < 70) {
            return 30.0;
        }

        if ($averageScore < 80) {
            return 15.0;
        }

        return 0.0;
    }

    private function computeBehavioralRisk(int $studentId): float
    {
        $risk = (float) Violation::query()
            ->where('student_id', $studentId)
            ->selectRaw("
                COALESCE(SUM(
                    CASE LOWER(severity)
                        WHEN 'severe' THEN 40
                        WHEN 'major' THEN 30
                        WHEN 'high' THEN 30
                        WHEN 'moderate' THEN 15
                        WHEN 'medium' THEN 15
                        WHEN 'minor' THEN 5
                        WHEN 'low' THEN 5
                        ELSE 5
                    END
                ), 0) as behavioral_risk
            ")
            ->value('behavioral_risk');

        return min($risk, 100.0);
    }

    private function determineRiskLevel(float $totalScore): string
    {
        if ($totalScore >= 60) {
            return 'high';
        }

        if ($totalScore >= 30) {
            return 'medium';
        }

        return 'low';
    }
}
