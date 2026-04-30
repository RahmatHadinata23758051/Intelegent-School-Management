<?php

namespace App\Services;

use App\Models\Student;
use App\Models\RiskScore;

class ScoringService
{
    private const ACADEMIC_WEIGHT = 0.6;
    private const BEHAVIORAL_WEIGHT = 0.4;
    private const MAX_SCORE = 100;

    public function calculateRiskScore(Student $student): array
    {
        $academicScore = $this->calculateAcademicScore($student);
        $behavioralScore = $this->calculateBehavioralScore($student);

        $totalScore = ($academicScore * self::ACADEMIC_WEIGHT) + 
                      ($behavioralScore * self::BEHAVIORAL_WEIGHT);

        $totalScore = min($totalScore, self::MAX_SCORE);

        $riskLevel = $this->determineRiskLevel($totalScore);

        return [
            'total_score' => round($totalScore, 2),
            'academic_score' => round($academicScore, 2),
            'behavioral_score' => round($behavioralScore, 2),
            'risk_level' => $riskLevel,
        ];
    }

    private function calculateAcademicScore(Student $student): float
    {
        $grades = $student->grades()->latest('created_at')->limit(5)->get();

        if ($grades->isEmpty()) {
            return 0;
        }

        $avgGrade = $grades->avg('score');

        return $this->mapGradeToRiskScore($avgGrade);
    }

    private function mapGradeToRiskScore(float $avgGrade): float
    {
        if ($avgGrade >= 85) {
            return 10;
        } elseif ($avgGrade >= 75) {
            return 25;
        } elseif ($avgGrade >= 65) {
            return 50;
        } elseif ($avgGrade >= 55) {
            return 70;
        } else {
            return 100;
        }
    }

    private function calculateBehavioralScore(Student $student): float
    {
        $violations = $student->violations()->latest('created_at')->limit(10)->get();

        if ($violations->isEmpty()) {
            return 0;
        }

        $behavioralScore = 0;

        foreach ($violations as $violation) {
            $severityScore = $this->getSeverityScore($violation->severity);
            $behavioralScore += $severityScore;
        }

        $avgViolationScore = $behavioralScore / count($violations);

        return min($avgViolationScore * count($violations), self::MAX_SCORE);
    }

    private function getSeverityScore(string $severity): float
    {
        return match ($severity) {
            'minor' => 5,
            'moderate' => 15,
            'major' => 30,
            'severe' => 50,
            default => 0,
        };
    }

    private function determineRiskLevel(float $score): string
    {
        if ($score <= 20) {
            return 'low';
        } elseif ($score <= 50) {
            return 'medium';
        } else {
            return 'high';
        }
    }

    public function updateStudentRiskScore(Student $student): void
    {
        $scoreData = $this->calculateRiskScore($student);

        RiskScore::updateOrCreate(
            ['student_id' => $student->id],
            [
                'total_score' => $scoreData['total_score'],
                'academic_score' => $scoreData['academic_score'],
                'behavioral_score' => $scoreData['behavioral_score'],
                'risk_level' => $scoreData['risk_level'],
                'last_updated' => now(),
            ]
        );

        $student->update(['risk_score' => $scoreData['total_score']]);
    }
}
