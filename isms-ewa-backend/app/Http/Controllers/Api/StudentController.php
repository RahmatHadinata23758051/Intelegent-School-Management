<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Traits\ApiResponse;

class StudentController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of students.
     */
    public function index()
    {
        $query = Student::with('schoolClass', 'riskScore');

        // Filter by school_class_id
        if (request()->has('school_class_id')) {
            $query->where('school_class_id', request('school_class_id'));
        }

        // Search by name, student_id, or email
        if (request()->has('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $students = $query->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Data siswa berhasil diambil.',
            'data' => StudentResource::collection($students),
        ]);
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        $student = Student::create($request->validated());

        return $this->createdResponse(
            new StudentResource($student->load('schoolClass', 'riskScore')),
            'Siswa berhasil dibuat.'
        );
    }

    /**
     * Display the specified student.
     */
    public function show(Student $student)
    {
        $student->load('schoolClass', 'grades', 'violations', 'riskScore');

        return $this->successResponse(
            new StudentResource($student),
            'Data siswa berhasil diambil.'
        );
    }

    /**
     * Update the specified student in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $student->update($request->validated());

        return $this->successResponse(
            new StudentResource($student->load('schoolClass', 'riskScore')),
            'Siswa berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified student from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return $this->successResponse(
            null,
            'Siswa berhasil dihapus.'
        );
    }
}
