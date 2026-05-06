<?php

namespace App\Http\Controllers\Api;

use App\Constants\UserRole;
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
        $this->authorize('recalculate', [RiskScore::class, $student]);

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

        $query = Student::with('schoolClass', 'riskScore')
            ->whereHas('riskScore', function ($q) use ($riskLevel) {
                $q->where('risk_level', $riskLevel);
            });

        // Scope data berdasarkan role
        $user = auth()->user();
        if ($user->role === UserRole::HOMEROOM_TEACHER) {
            // Homeroom teacher hanya melihat siswa di kelas yang dia wali
            $query->whereHas('schoolClass', function ($q) use ($user) {
                $q->where('homeroom_teacher_id', $user->id);
            });
        }

        $students = $query->paginate(15);

        return response()->json([
            'success' => true,
            'message' => "Daftar siswa dengan risk level {$riskLevel}.",
            'data' => StudentResource::collection($students),
        ]);
    }
}
