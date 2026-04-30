<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SchoolClassController extends Controller
{
    public function index(): JsonResponse
    {
        $classes = SchoolClass::with('students', 'homeRoomTeacher')->get();

        return response()->json([
            'success' => true,
            'data' => $classes,
        ]);
    }

    public function show(SchoolClass $class): JsonResponse
    {
        $class->load('students.riskScore', 'homeRoomTeacher');

        return response()->json([
            'success' => true,
            'data' => $class,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:school_classes',
            'grade_level' => 'required|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ]);

        $class = SchoolClass::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Class created successfully',
            'data' => $class,
        ], 201);
    }

    public function update(Request $request, SchoolClass $class): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:school_classes,name,' . $class->id,
            'grade_level' => 'sometimes|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ]);

        $class->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Class updated successfully',
            'data' => $class,
        ]);
    }

    public function destroy(SchoolClass $class): JsonResponse
    {
        $class->delete();

        return response()->json([
            'success' => true,
            'message' => 'Class deleted successfully',
        ]);
    }
}
