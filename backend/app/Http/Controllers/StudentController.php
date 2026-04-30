<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    private StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function index(): JsonResponse
    {
        $students = Student::with('riskScore', 'class')->get();

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function show(Student $student): JsonResponse
    {
        $student = $this->studentService->getStudentWithRiskInfo($student);

        return response()->json([
            'success' => true,
            'data' => $student,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'student_id' => 'required|string|unique:students',
            'class_id' => 'required|exists:school_classes,id',
        ]);

        $student = $this->studentService->createStudent($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => $student,
        ], 201);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:students,email,' . $student->id,
            'class_id' => 'sometimes|exists:school_classes,id',
        ]);

        $student = $this->studentService->updateStudent($student, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student,
        ]);
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }

    public function getByRiskLevel(Request $request): JsonResponse
    {
        $riskLevel = $request->query('level', 'high');
        $limit = $request->query('limit', 20);

        $students = $this->studentService->getStudentsByRiskLevel($riskLevel, $limit);

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }
}
