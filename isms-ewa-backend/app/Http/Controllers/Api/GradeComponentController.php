<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GradeComponent\StoreGradeComponentRequest;
use App\Http\Requests\GradeComponent\UpdateGradeComponentRequest;
use App\Http\Resources\GradeComponentResource;
use App\Models\GradeComponent;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class GradeComponentController extends Controller
{
    use ApiResponse;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of grade components
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', GradeComponent::class);

        $query = GradeComponent::query();

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        // Sort
        $sortBy = $request->get('sort', 'sort_order');
        $sortDir = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $gradeComponents = $query->paginate($perPage);

        return $this->successResponse(
            [
                'data' => GradeComponentResource::collection($gradeComponents),
                'meta' => [
                    'total' => $gradeComponents->total(),
                    'per_page' => $gradeComponents->perPage(),
                    'current_page' => $gradeComponents->currentPage(),
                    'last_page' => $gradeComponents->lastPage(),
                ]
            ],
            'Data komponen nilai berhasil diambil'
        );
    }

    /**
     * Get dropdown list of active grade components
     */
    public function dropdown()
    {
        $this->authorize('viewAny', GradeComponent::class);

        $gradeComponents = GradeComponent::active()
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'code', 'name', 'default_weight']);

        return $this->successResponse(
            $gradeComponents,
            'Dropdown komponen nilai berhasil diambil'
        );
    }

    /**
     * Get active grade components
     */
    public function active()
    {
        $this->authorize('viewAny', GradeComponent::class);

        $gradeComponents = GradeComponent::active()
            ->orderBy('sort_order', 'asc')
            ->get();

        return $this->successResponse(
            GradeComponentResource::collection($gradeComponents),
            'Komponen nilai aktif berhasil diambil'
        );
    }

    /**
     * Store a newly created grade component
     */
    public function store(StoreGradeComponentRequest $request)
    {
        $this->authorize('create', GradeComponent::class);

        $gradeComponent = GradeComponent::create($request->validated());

        return $this->successResponse(
            new GradeComponentResource($gradeComponent),
            'Komponen nilai berhasil dibuat',
            [],
            201
        );
    }

    /**
     * Display the specified grade component
     */
    public function show(GradeComponent $gradeComponent)
    {
        $this->authorize('view', $gradeComponent);

        return $this->successResponse(
            new GradeComponentResource($gradeComponent),
            'Detail komponen nilai berhasil diambil'
        );
    }

    /**
     * Update the specified grade component
     */
    public function update(UpdateGradeComponentRequest $request, GradeComponent $gradeComponent)
    {
        $this->authorize('update', $gradeComponent);

        $gradeComponent->update($request->validated());

        return $this->successResponse(
            new GradeComponentResource($gradeComponent),
            'Komponen nilai berhasil diperbarui'
        );
    }

    /**
     * Remove the specified grade component
     */
    public function destroy(GradeComponent $gradeComponent)
    {
        $this->authorize('delete', $gradeComponent);

        // Soft delete to preserve history
        $gradeComponent->delete();

        return $this->successResponse(
            null,
            'Komponen nilai berhasil dihapus'
        );
    }
}
