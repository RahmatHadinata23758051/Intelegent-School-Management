<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Violation\StoreViolationRequest;
use App\Http\Requests\Violation\UpdateViolationRequest;
use App\Http\Resources\ViolationResource;
use App\Models\Violation;
use App\Models\Student;
use App\Traits\ApiResponse;

class ViolationController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of violations for a student.
     */
    public function index(Student $student)
    {
        $violations = $student->violations()->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Data pelanggaran berhasil diambil.',
            'data' => ViolationResource::collection($violations),
        ]);
    }

    /**
     * Store a newly created violation for a student.
     */
    public function store(StoreViolationRequest $request, Student $student)
    {
        $violation = $student->violations()->create($request->validated());

        return $this->createdResponse(
            new ViolationResource($violation->load('student', 'reporter')),
            'Pelanggaran berhasil dibuat.'
        );
    }

    /**
     * Display the specified violation for a student.
     */
    public function show(Student $student, Violation $violation)
    {
        // Ensure the violation belongs to the student
        if ($violation->student_id !== $student->id) {
            return $this->notFoundResponse('Pelanggaran tidak ditemukan.');
        }

        $violation->load('student', 'reporter');

        return $this->successResponse(
            new ViolationResource($violation),
            'Data pelanggaran berhasil diambil.'
        );
    }

    /**
     * Update the specified violation for a student.
     */
    public function update(UpdateViolationRequest $request, Student $student, Violation $violation)
    {
        // Ensure the violation belongs to the student
        if ($violation->student_id !== $student->id) {
            return $this->notFoundResponse('Pelanggaran tidak ditemukan.');
        }

        $violation->update($request->validated());

        return $this->successResponse(
            new ViolationResource($violation->load('student', 'reporter')),
            'Pelanggaran berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified violation for a student.
     */
    public function destroy(Student $student, Violation $violation)
    {
        // Ensure the violation belongs to the student
        if ($violation->student_id !== $student->id) {
            return $this->notFoundResponse('Pelanggaran tidak ditemukan.');
        }

        $violation->delete();

        return $this->successResponse(
            null,
            'Pelanggaran berhasil dihapus.'
        );
    }
}
