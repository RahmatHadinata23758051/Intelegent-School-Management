<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Resources\ViolationResource;
use App\Models\Grade;
use App\Models\RiskScore;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Violation;
use App\Traits\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get dashboard statistics
     */
    public function statistics()
    {
        $totalStudents = Student::count();
        $totalClasses = SchoolClass::count();
        $totalGrades = Grade::count();
        $totalViolations = Violation::count();

        // Risk distribution
        $riskDistribution = [
            'safe' => RiskScore::where('risk_level', 'safe')->count(),
            'warning' => RiskScore::where('risk_level', 'warning')->count(),
            'high_risk' => RiskScore::where('risk_level', 'high_risk')->count(),
        ];

        // Average scores
        $averageTotalScore = RiskScore::avg('total_score') ?? 0;
        $averageAcademicScore = RiskScore::avg('academic_score') ?? 0;
        $averageBehavioralScore = RiskScore::avg('behavioral_score') ?? 0;

        // High risk students (max 5)
        $highRiskStudents = Student::with('schoolClass', 'riskScore')
            ->whereHas('riskScore', function ($query) {
                $query->where('risk_level', 'high_risk');
            })
            ->limit(5)
            ->get();

        // Recent violations (max 5)
        $recentViolations = Violation::with('student', 'reporter')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $statistics = [
            'total_students' => $totalStudents,
            'total_classes' => $totalClasses,
            'total_grades' => $totalGrades,
            'total_violations' => $totalViolations,
            'risk_distribution' => $riskDistribution,
            'average_total_score' => round($averageTotalScore, 2),
            'average_academic_score' => round($averageAcademicScore, 2),
            'average_behavioral_score' => round($averageBehavioralScore, 2),
            'high_risk_students' => StudentResource::collection($highRiskStudents),
            'recent_violations' => ViolationResource::collection($recentViolations),
        ];

        return $this->successResponse(
            $statistics,
            'Statistik dashboard berhasil diambil.'
        );
    }
}
