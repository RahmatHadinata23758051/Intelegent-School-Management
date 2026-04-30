<?php

namespace App\Http\Controllers;

use App\Models\Violation;
use App\Models\Student;
use App\Services\ViolationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ViolationController extends Controller
{
    private ViolationService $violationService;

    public function __construct(ViolationService $violationService)
    {
        $this->violationService = $violationService;
    }

    public function index(Student $student): JsonResponse
    {
        $violations = $this->violationService->getStudentViolations($student);

        return response()->json([
            'success' => true,
            'data' => $violations,
        ]);
    }

    public function store(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'severity' => 'required|string|in:minor,moderate,major,severe',
            'reported_by' => 'required|string|max:255',
            'reported_date' => 'required|date',
        ]);

        $validated['student_id'] = $student->id;

        $violation = $this->violationService->createViolation($validated);

        return response()->json([
            'success' => true,
            'message' => 'Violation recorded and risk score updated',
            'data' => $violation,
        ], 201);
    }

    public function update(Request $request, Student $student, Violation $violation): JsonResponse
    {
        if ($violation->student_id !== $student->id) {
            return response()->json([
                'success' => false,
                'message' => 'Violation does not belong to this student',
            ], 404);
        }

        $validated = $request->validate([
            'description' => 'sometimes|string|max:1000',
            'severity' => 'sometimes|string|in:minor,moderate,major,severe',
        ]);

        $violation = $this->violationService->updateViolation($violation, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Violation updated and risk score recalculated',
            'data' => $violation,
        ]);
    }

    public function destroy(Student $student, Violation $violation): JsonResponse
    {
        if ($violation->student_id !== $student->id) {
            return response()->json([
                'success' => false,
                'message' => 'Violation does not belong to this student',
            ], 404);
        }

        $this->violationService->deleteViolation($violation);

        return response()->json([
            'success' => true,
            'message' => 'Violation deleted and risk score updated',
        ]);
    }
}
