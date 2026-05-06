<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RiskScoreResource;
use App\Http\Resources\StudentResource;
use App\Models\RiskScore;
use App\Models\Student;
use App\Services\ScoringService;
use App\Traits\ApiResponse;

class RiskScoreController extends Controller
{
    use ApiResponse;

    protected $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    /**
     * Recalculate risk score for a student
     */
    public function recalculate(Student $student)
    {
        $riskScore = $this->scoringService->updateStudentRiskScore($student);

        return $this->successResponse(
            new RiskScoreResource($riskScore),
            'Risk score siswa berhasil dihitung ulang.'
        );
    }

    /**
     * Filter students by risk level
     */
    public function filterByRiskLevel(string $riskLevel)
    {
        // Validate risk level
        $validLevels = ['safe', 'warning', 'high_risk'];
        if (!in_array($riskLevel, $validLevels)) {
            return $this->errorResponse(
                'Risk level harus salah satu dari: safe, warning, high_risk',
                null,
                422
            );
        }

        $students = Student::with('schoolClass', 'riskScore')
            ->whereHas('riskScore', function ($query) use ($riskLevel) {
                $query->where('risk_level', $riskLevel);
            })
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => "Daftar siswa dengan risk level {$riskLevel}.",
            'data' => StudentResource::collection($students),
        ]);
    }
}
