<?php

namespace App\Services;

use App\Models\RiskScore;
use App\Models\Student;

class ScoringService
{
    /**
     * Calculate academic risk score based on average grades
     * 
     * Mapping:
     * - Average >= 85      => 10
     * - Average 75-84.99   => 25
     * - Average 65-74.99   => 50
     * - Average 55-64.99   => 70
     * - Average < 55       => 100
     * - No grades          => 0
     */
    public function calculateAcademicScore(Student $student): float
    {
        $grades = $student->grades()->pluck('score');

        if ($grades->isEmpty()) {
            return 0;
        }

        $average = $grades->avg();

        if ($average >= 85) {
            return 10;
        } elseif ($average >= 75) {
            return 25;
        } elseif ($average >= 65) {
            return 50;
        } elseif ($average >= 55) {
            return 70;
        } else {
            return 100;
        }
    }

    /**
     * Calculate behavioral risk score based on violations
     * 
     * Severity mapping:
     * - minor    => +5
     * - moderate => +15
     * - major    => +30
     * - severe   => +50
     * 
     * Maximum score: 100
     */
    public function calculateBehavioralScore(Student $student): float
    {
        $violations = $student->violations()->get();

        if ($violations->isEmpty()) {
            return 0;
        }

        $totalScore = 0;

        foreach ($violations as $violation) {
            $totalScore += $this->getSeverityWeight($violation->severity);
        }

        // Cap at 100
        return min($totalScore, 100);
    }

    /**
     * Get severity weight for behavioral score
     */
    private function getSeverityWeight(string $severity): int
    {
        return match ($severity) {
            'minor' => 5,
            'moderate' => 15,
            'major' => 30,
            'severe' => 50,
            default => 0,
        };
    }

    /**
     * Calculate total risk score using 60/40 formula
     * 
     * Formula: (academic_score * 0.6) + (behavioral_score * 0.4)
     */
    public function calculateTotalScore(float $academicScore, float $behavioralScore): float
    {
        $total = ($academicScore * 0.6) + ($behavioralScore * 0.4);
        return round($total, 2);
    }

    /**
     * Determine risk level based on total score
     * 
     * - total_score <= 20              => safe
     * - total_score > 20 and <= 50     => warning
     * - total_score > 50               => high_risk
     */
    public function determineRiskLevel(float $totalScore): string
    {
        if ($totalScore <= 20) {
            return 'safe';
        } elseif ($totalScore <= 50) {
            return 'warning';
        } else {
            return 'high_risk';
        }
    }

    /**
     * Calculate all risk components for a student
     */
    public function calculateStudentRisk(Student $student): array
    {
        $academicScore = $this->calculateAcademicScore($student);
        $behavioralScore = $this->calculateBehavioralScore($student);
        $totalScore = $this->calculateTotalScore($academicScore, $behavioralScore);
        $riskLevel = $this->determineRiskLevel($totalScore);

        return [
            'academic_score' => $academicScore,
            'behavioral_score' => $behavioralScore,
            'total_score' => $totalScore,
            'risk_level' => $riskLevel,
        ];
    }

    /**
     * Update or create risk score for a student
     */
    public function updateStudentRiskScore(Student $student): RiskScore
    {
        $riskData = $this->calculateStudentRisk($student);

        $riskScore = RiskScore::updateOrCreate(
            ['student_id' => $student->id],
            [
                'academic_score' => $riskData['academic_score'],
                'behavioral_score' => $riskData['behavioral_score'],
                'total_score' => $riskData['total_score'],
                'risk_level' => $riskData['risk_level'],
                'last_updated' => now(),
            ]
        );

        return $riskScore;
    }
}
