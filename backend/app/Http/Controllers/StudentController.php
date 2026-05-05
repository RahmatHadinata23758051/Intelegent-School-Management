<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Traits\ApiResponse;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    use ApiResponse;

    private StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function index(): JsonResponse
    {
        $students = $this->studentService->getAllStudents();

        return $this->success($students);
    }

    public function show(Student $student): JsonResponse
    {
        $student = $this->studentService->getStudentWithRiskInfo($student);

        return $this->success($student);
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

        return $this->success($student, 'Student created successfully', 201);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:students,email,' . $student->id,
            'class_id' => 'sometimes|exists:school_classes,id',
        ]);

        $student = $this->studentService->updateStudent($student, $validated);

        return $this->success($student, 'Student updated successfully');
    }

    public function destroy(Student $student): JsonResponse
    {
        $this->studentService->deleteStudent($student);

        return $this->success(null, 'Student deleted successfully');
    }

    public function getByRiskLevel(Request $request): JsonResponse
    {
        $riskLevel = $request->query('level', 'high');
        $limit = (int) $request->query('limit', 20);

        $students = $this->studentService->getStudentsByRiskLevel($riskLevel, $limit);

        return $this->success($students);
    }

    public function statistics(): JsonResponse
    {
        $statistics = $this->studentService->getStudentStatistics();

        return $this->success($statistics);
    }
}
