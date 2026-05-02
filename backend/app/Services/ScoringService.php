<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\Violation;
use App\Models\RiskScore;
use Carbon\Carbon;

class ScoringService
{
    public function calculateRisk(int $studentId): RiskScore
    {
        $academicScore = $this->computeAcademicRisk($studentId);
        $behavioralScore = $this->computeBehavioralRisk($studentId);
        
        $totalScore = $academicScore + $behavioralScore;
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

    private function computeAcademicRisk(int $studentId): float
    {
        $grades = Grade::where('student_id', $studentId)->get();

        if ($grades->isEmpty()) {
            return 0.0;
        }

        $averageScore = $grades->avg('score');
        
        if ($averageScore < 50) {
            return 50.0;
        } elseif ($averageScore < 70) {
            return 30.0;
        } elseif ($averageScore < 80) {
            return 10.0;
        }

        return 0.0;
    }

    private function computeBehavioralRisk(int $studentId): float
    {
        $violations = Violation::where('student_id', $studentId)->get();

        $risk = 0.0;

        foreach ($violations as $violation) {
            switch (strtolower($violation->severity)) {
                case 'high':
                    $risk += 30.0;
                    break;
                case 'medium':
                    $risk += 15.0;
                    break;
                case 'low':
                    $risk += 5.0;
                    break;
                default:
                    $risk += 5.0;
                    break;
            }
        }

        return min($risk, 100.0);
    }

    private function determineRiskLevel(float $totalScore): string
    {
        if ($totalScore >= 60) {
            return 'High Risk';
        } elseif ($totalScore >= 30) {
            return 'Warning';
        }

        return 'Safe';
    }
}
