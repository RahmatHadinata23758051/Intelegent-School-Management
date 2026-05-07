<?php

namespace App\Http\Controllers\Api;

use App\Constants\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicYear\StoreAcademicYearRequest;
use App\Http\Requests\AcademicYear\UpdateAcademicYearRequest;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Services\AcademicPeriodService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    use ApiResponse;

    protected AcademicPeriodService $academicPeriodService;

    public function __construct(AcademicPeriodService $academicPeriodService)
    {
        $this->academicPeriodService = $academicPeriodService;
    }

    /**
     * Display a listing of academic years.
     */
    public function index()
    {
        $this->authorize('viewAny', AcademicYear::class);

        $query = AcademicYear::with('semesters');

        // Search by year
        if (request()->has('search')) {
            $search = request('search');
            $query->where('year', 'like', "%{$search}%");
        }

        // Sort
        $sortBy = request('sort_by', 'year');
        $sortDir = request('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $academicYears = $query->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Data tahun ajaran berhasil diambil.',
            'data' => AcademicYearResource::collection($academicYears),
        ]);
    }

    /**
     * Store a newly created academic year in storage.
     */
    public function store(StoreAcademicYearRequest $request)
    {
        $this->authorize('create', AcademicYear::class);

        $academicYear = AcademicYear::create($request->validated());

        return $this->createdResponse(
            new AcademicYearResource($academicYear->load('semesters')),
            'Tahun ajaran berhasil dibuat.'
        );
    }

    /**
     * Display the specified academic year.
     */
    public function show(AcademicYear $academicYear)
    {
        $this->authorize('view', $academicYear);

        $academicYear->load('semesters');

        return $this->successResponse(
            new AcademicYearResource($academicYear),
            'Data tahun ajaran berhasil diambil.'
        );
    }

    /**
     * Update the specified academic year in storage.
     */
    public function update(UpdateAcademicYearRequest $request, AcademicYear $academicYear)
    {
        $this->authorize('update', $academicYear);

        $academicYear->update($request->validated());

        return $this->successResponse(
            new AcademicYearResource($academicYear->load('semesters')),
            'Tahun ajaran berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified academic year from storage.
     */
    public function destroy(AcademicYear $academicYear)
    {
        $this->authorize('delete', $academicYear);

        // Check if academic year is active
        if (!$this->academicPeriodService->canDeleteAcademicYear($academicYear)) {
            return $this->errorResponse(
                'Tidak bisa menghapus tahun ajaran yang sedang aktif.',
                null,
                422
            );
        }

        $academicYear->delete();

        return $this->successResponse(
            null,
            'Tahun ajaran berhasil dihapus.'
        );
    }

    /**
     * Activate the specified academic year.
     */
    public function activate(AcademicYear $academicYear)
    {
        $this->authorize('activate', $academicYear);

        $academicYear = $this->academicPeriodService->activateAcademicYear($academicYear);

        return $this->successResponse(
            new AcademicYearResource($academicYear->load('semesters')),
            'Tahun ajaran berhasil diaktifkan.'
        );
    }

    /**
     * Get active academic year.
     */
    public function getActive()
    {
        $academicYear = $this->academicPeriodService->getActiveAcademicYear();

        if (!$academicYear) {
            return $this->errorResponse(
                'Tidak ada tahun ajaran yang aktif.',
                null,
                404
            );
        }

        return $this->successResponse(
            new AcademicYearResource($academicYear->load('semesters')),
            'Data tahun ajaran aktif berhasil diambil.'
        );
    }
}
