<?php

namespace App\Http\Controllers\Api;

use App\Constants\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Semester\StoreSemesterRequest;
use App\Http\Requests\Semester\UpdateSemesterRequest;
use App\Http\Resources\SemesterResource;
use App\Models\Semester;
use App\Services\AcademicPeriodService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    use ApiResponse;

    protected AcademicPeriodService $academicPeriodService;

    public function __construct(AcademicPeriodService $academicPeriodService)
    {
        $this->academicPeriodService = $academicPeriodService;
    }

    /**
     * Display a listing of semesters.
     */
    public function index()
    {
        $this->authorize('viewAny', Semester::class);

        $query = Semester::with('academicYear');

        // Filter by academic year
        if (request()->has('academic_year_id')) {
            $query->where('academic_year_id', request('academic_year_id'));
        }

        // Sort
        $sortBy = request('sort_by', 'semester_number');
        $sortDir = request('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        $semesters = $query->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Data semester berhasil diambil.',
            'data' => SemesterResource::collection($semesters),
        ]);
    }

    /**
     * Store a newly created semester in storage.
     */
    public function store(StoreSemesterRequest $request)
    {
        $this->authorize('create', Semester::class);

        $semester = Semester::create($request->validated());

        return $this->createdResponse(
            new SemesterResource($semester->load('academicYear')),
            'Semester berhasil dibuat.'
        );
    }

    /**
     * Display the specified semester.
     */
    public function show(Semester $semester)
    {
        $this->authorize('view', $semester);

        $semester->load('academicYear');

        return $this->successResponse(
            new SemesterResource($semester),
            'Data semester berhasil diambil.'
        );
    }

    /**
     * Update the specified semester in storage.
     */
    public function update(UpdateSemesterRequest $request, Semester $semester)
    {
        $this->authorize('update', $semester);

        $semester->update($request->validated());

        return $this->successResponse(
            new SemesterResource($semester->load('academicYear')),
            'Semester berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified semester from storage.
     */
    public function destroy(Semester $semester)
    {
        $this->authorize('delete', $semester);

        // Check if semester is active
        if (!$this->academicPeriodService->canDeleteSemester($semester)) {
            return $this->errorResponse(
                'Tidak bisa menghapus semester yang sedang aktif.',
                422
            );
        }

        $semester->delete();

        return $this->successResponse(
            null,
            'Semester berhasil dihapus.'
        );
    }

    /**
     * Activate the specified semester.
     */
    public function activate(Semester $semester)
    {
        $this->authorize('activate', $semester);

        $semester = $this->academicPeriodService->activateSemester($semester);

        return $this->successResponse(
            new SemesterResource($semester->load('academicYear')),
            'Semester berhasil diaktifkan.'
        );
    }

    /**
     * Get active semester.
     */
    public function getActive()
    {
        $semester = $this->academicPeriodService->getActiveSemesterWithYear();

        if (!$semester) {
            return $this->errorResponse(
                'Tidak ada semester yang aktif.',
                404
            );
        }

        return $this->successResponse(
            new SemesterResource($semester),
            'Data semester aktif berhasil diambil.'
        );
    }

    /**
     * Get semesters by academic year.
     */
    public function getByAcademicYear(Request $request)
    {
        $academicYearId = $request->query('academic_year_id');

        if (!$academicYearId) {
            return $this->errorResponse(
                'academic_year_id harus diisi.',
                422
            );
        }

        $semesters = Semester::where('academic_year_id', $academicYearId)
            ->with('academicYear')
            ->orderBy('semester_number')
            ->get();

        return $this->successResponse(
            SemesterResource::collection($semesters),
            'Data semester berhasil diambil.'
        );
    }
}
