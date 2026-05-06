<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Grade\StoreGradeRequest;
use App\Http\Requests\Grade\UpdateGradeRequest;
use App\Http\Resources\GradeResource;
use App\Models\Grade;
use App\Models\Student;
use App\Traits\ApiResponse;

class GradeController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of grades for a student.
     */
    public function index(Student $student)
    {
        $this->authorize('viewAny', [Grade::class, $student]);

        $grades = $student->grades()->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Data nilai berhasil diambil.',
            'data' => GradeResource::collection($grades),
        ]);
    }

    /**
     * Store a newly created grade for a student.
     */
    public function store(StoreGradeRequest $request, Student $student)
    {
        $this->authorize('create', [Grade::class, $student]);

        $grade = $student->grades()->create($request->validated());

        return $this->createdResponse(
            new GradeResource($grade->load('student')),
            'Nilai berhasil dibuat.'
        );
    }

    /**
     * Display the specified grade for a student.
     */
    public function show(Student $student, Grade $grade)
    {
        // Ensure the grade belongs to the student
        if ($grade->student_id !== $student->id) {
            return $this->notFoundResponse('Nilai tidak ditemukan.');
        }

        $this->authorize('view', $grade);

        $grade->load('student');

        return $this->successResponse(
            new GradeResource($grade),
            'Data nilai berhasil diambil.'
        );
    }

    /**
     * Update the specified grade for a student.
     */
    public function update(UpdateGradeRequest $request, Student $student, Grade $grade)
    {
        // Ensure the grade belongs to the student
        if ($grade->student_id !== $student->id) {
            return $this->notFoundResponse('Nilai tidak ditemukan.');
        }

        $this->authorize('update', $grade);

        $grade->update($request->validated());

        return $this->successResponse(
            new GradeResource($grade->load('student')),
            'Nilai berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified grade for a student.
     */
    public function destroy(Student $student, Grade $grade)
    {
        // Ensure the grade belongs to the student
        if ($grade->student_id !== $student->id) {
            return $this->notFoundResponse('Nilai tidak ditemukan.');
        }

        $this->authorize('delete', $grade);

        $grade->delete();

        return $this->successResponse(
            null,
            'Nilai berhasil dihapus.'
        );
    }
}
