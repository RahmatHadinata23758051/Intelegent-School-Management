<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use App\Services\SubjectService;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    protected $service;

    public function __construct(SubjectService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of subjects.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Subject::class);

        $query = Subject::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter status
        if ($request->has('status') && $request->status !== 'all') {
            $query->byStatus($request->status);
        }

        // Sort
        $sort = $request->get('sort', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSorts = ['id', 'code', 'name', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 15);
        $subjects = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Subjects retrieved successfully',
            'data' => SubjectResource::collection($subjects->items()),
            'pagination' => [
                'total' => $subjects->total(),
                'per_page' => $subjects->perPage(),
                'current_page' => $subjects->currentPage(),
                'last_page' => $subjects->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created subject in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        $this->authorize('create', Subject::class);

        try {
            $subject = $this->service->createSubject($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Subject created successfully',
                'data' => new SubjectResource($subject),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified subject.
     */
    public function show(Subject $subject)
    {
        $this->authorize('view', $subject);

        return response()->json([
            'success' => true,
            'message' => 'Subject retrieved successfully',
            'data' => new SubjectResource($subject),
        ]);
    }

    /**
     * Update the specified subject in storage.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        $this->authorize('update', $subject);

        try {
            $this->service->updateSubject($subject, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Subject updated successfully',
                'data' => new SubjectResource($subject),
            ]);
        } catch (\Throwable $e) {
            \Log::error('Subject Update Error: ' . $e->getMessage(), [
                'exception' => $e,
                'subject' => $subject->id,
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified subject from storage.
     */
    public function destroy(Subject $subject)
    {
        $this->authorize('delete', $subject);

        try {
            $this->service->deleteSubject($subject);

            return response()->json([
                'success' => true,
                'message' => 'Subject deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get dropdown list of active subjects.
     */
    public function dropdown()
    {
        $this->authorize('viewAny', Subject::class);

        $subjects = $this->service->getDropdownList();

        return response()->json([
            'success' => true,
            'message' => 'Subject dropdown retrieved successfully',
            'data' => SubjectResource::collection($subjects),
        ]);
    }
}
