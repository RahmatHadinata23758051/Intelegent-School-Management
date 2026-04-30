<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Student;
use App\Services\GradeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GradeController extends Controller
{
    private GradeService $gradeService;

    public function __construct(GradeService $gradeService)
    {
        $this->gradeService = $gradeService;
    }

    public function index(Student $student): JsonResponse
    {
        $grades = $this->gradeService->getStudentGrades($student);

        return response()->json([
            'success' => true,
            'data' => $grades,
        ]);
    }

    public function store(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'score' => 'required|numeric|min:0|max:100',
            'semester' => 'required|string|in:1,2',
            'academic_year' => 'required|string',
        ]);

        $validated['student_id'] = $student->id;

        $grade = $this->gradeService->createGrade($validated);

        return response()->json([
            'success' => true,
            'message' => 'Grade created successfully and risk score updated',
            'data' => $grade,
        ], 201);
    }

    public function update(Request $request, Student $student, Grade $grade): JsonResponse
    {
        if ($grade->student_id !== $student->id) {
            return response()->json([
                'success' => false,
                'message' => 'Grade does not belong to this student',
            ], 404);
        }

        $validated = $request->validate([
            'score' => 'sometimes|numeric|min:0|max:100',
            'subject' => 'sometimes|string|max:255',
        ]);

        $grade = $this->gradeService->updateGrade($grade, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Grade updated successfully and risk score recalculated',
            'data' => $grade,
        ]);
    }

    public function destroy(Student $student, Grade $grade): JsonResponse
    {
        if ($grade->student_id !== $student->id) {
            return response()->json([
                'success' => false,
                'message' => 'Grade does not belong to this student',
            ], 404);
        }

        $this->gradeService->deleteGrade($grade);

        return response()->json([
            'success' => true,
            'message' => 'Grade deleted and risk score updated',
        ]);
    }
}
