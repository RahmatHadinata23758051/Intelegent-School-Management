<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolClass\StoreSchoolClassRequest;
use App\Http\Requests\SchoolClass\UpdateSchoolClassRequest;
use App\Http\Resources\SchoolClassResource;
use App\Models\SchoolClass;
use App\Traits\ApiResponse;

class SchoolClassController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of school classes.
     */
    public function index()
    {
        $this->authorize('viewAny', SchoolClass::class);

        $classes = SchoolClass::with('homeroomTeacher')
            ->withCount('students')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Data kelas berhasil diambil.',
            'data' => SchoolClassResource::collection($classes),
        ]);
    }

    /**
     * Store a newly created school class in storage.
     */
    public function store(StoreSchoolClassRequest $request)
    {
        $this->authorize('create', SchoolClass::class);

        $class = SchoolClass::create($request->validated());

        return $this->createdResponse(
            new SchoolClassResource($class->load('homeroomTeacher')),
            'Kelas berhasil dibuat.'
        );
    }

    /**
     * Display the specified school class.
     */
    public function show(SchoolClass $schoolClass)
    {
        $this->authorize('view', $schoolClass);

        $schoolClass->load('homeroomTeacher');
        $schoolClass->loadCount('students');

        return $this->successResponse(
            new SchoolClassResource($schoolClass),
            'Data kelas berhasil diambil.'
        );
    }

    /**
     * Update the specified school class in storage.
     */
    public function update(UpdateSchoolClassRequest $request, SchoolClass $schoolClass)
    {
        $this->authorize('update', $schoolClass);

        $schoolClass->update($request->validated());

        return $this->successResponse(
            new SchoolClassResource($schoolClass->load('homeroomTeacher')),
            'Kelas berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified school class from storage.
     */
    public function destroy(SchoolClass $schoolClass)
    {
        $this->authorize('delete', $schoolClass);

        $schoolClass->delete();

        return $this->successResponse(
            null,
            'Kelas berhasil dihapus.'
        );
    }
}
