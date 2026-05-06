<?php

namespace App\Http\Controllers\Api;

use App\Constants\UserRole;
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
        $this->authorize('viewStatistics', 'dashboard');

        $user = auth()->user();

        // Scope data berdasarkan role
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            // Homeroom teacher hanya melihat data kelas yang dia wali
            $homeroomClasses = $user->homeroomClasses()->pluck('id');

            $totalStudents = Student::whereIn('school_class_id', $homeroomClasses)->count();
            $totalClasses = $homeroomClasses->count();
            $totalGrades = Grade::whereHas('student', function ($q) use ($homeroomClasses) {
                $q->whereIn('school_class_id', $homeroomClasses);
            })->count();
            $totalViolations = Violation::whereHas('student', function ($q) use ($homeroomClasses) {
                $q->whereIn('school_class_id', $homeroomClasses);
            })->count();

            // Risk distribution
            $riskDistribution = [
                'safe' => RiskScore::whereHas('student', function ($q) use ($homeroomClasses) {
                    $q->whereIn('school_class_id', $homeroomClasses);
                })->where('risk_level', 'safe')->count(),
                'warning' => RiskScore::whereHas('student', function ($q) use ($homeroomClasses) {
                    $q->whereIn('school_class_id', $homeroomClasses);
                })->where('risk_level', 'warning')->count(),
                'high_risk' => RiskScore::whereHas('student', function ($q) use ($homeroomClasses) {
                    $q->whereIn('school_class_id', $homeroomClasses);
                })->where('risk_level', 'high_risk')->count(),
            ];

            // Average scores
            $averageTotalScore = RiskScore::whereHas('student', function ($q) use ($homeroomClasses) {
                $q->whereIn('school_class_id', $homeroomClasses);
            })->avg('total_score') ?? 0;
            $averageAcademicScore = RiskScore::whereHas('student', function ($q) use ($homeroomClasses) {
                $q->whereIn('school_class_id', $homeroomClasses);
            })->avg('academic_score') ?? 0;
            $averageBehavioralScore = RiskScore::whereHas('student', function ($q) use ($homeroomClasses) {
                $q->whereIn('school_class_id', $homeroomClasses);
            })->avg('behavioral_score') ?? 0;

            // High risk students (max 5)
            $highRiskStudents = Student::with('schoolClass', 'riskScore')
                ->whereIn('school_class_id', $homeroomClasses)
                ->whereHas('riskScore', function ($query) {
                    $query->where('risk_level', 'high_risk');
                })
                ->limit(5)
                ->get();

            // Recent violations (max 5)
            $recentViolations = Violation::with('student', 'reporter')
                ->whereHas('student', function ($q) use ($homeroomClasses) {
                    $q->whereIn('school_class_id', $homeroomClasses);
                })
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        } else {
            // Admin dan teacher melihat data global
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
        }

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
