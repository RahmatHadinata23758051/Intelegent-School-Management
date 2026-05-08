<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClassSubject\StoreClassSubjectRequest;
use App\Http\Requests\ClassSubject\UpdateClassSubjectRequest;
use App\Http\Resources\ClassSubjectResource;
use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Services\ClassSubjectService;
use Illuminate\Http\Request;

class ClassSubjectController extends Controller
{
    protected $service;

    public function __construct(ClassSubjectService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of class subjects.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ClassSubject::class);

        $query = ClassSubject::with(['schoolClass', 'subject']);

        // Filter by school_class_id
        if ($request->has('school_class_id') && $request->school_class_id) {
            $query->where('school_class_id', $request->school_class_id);
        }

        // Filter by subject_id
        if ($request->has('subject_id') && $request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->byStatus($request->status);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Sort
        $sort = $request->get('sort', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSorts = ['id', 'created_at', 'school_class_id', 'subject_id'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 15);
        $classSubjects = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Class subjects retrieved successfully',
            'data' => ClassSubjectResource::collection($classSubjects->items()),
            'pagination' => [
                'total' => $classSubjects->total(),
                'per_page' => $classSubjects->perPage(),
                'current_page' => $classSubjects->currentPage(),
                'last_page' => $classSubjects->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created class subject in storage.
     */
    public function store(StoreClassSubjectRequest $request)
    {
        $this->authorize('create', ClassSubject::class);

        try {
            $classSubject = $this->service->assignSubjectToClass(
                $request->school_class_id,
                $request->subject_id,
                $request->get('is_active', true)
            );

            return response()->json([
                'success' => true,
                'message' => 'Class subject assigned successfully',
                'data' => new ClassSubjectResource($classSubject->load(['schoolClass', 'subject'])),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified class subject.
     */
    public function show(ClassSubject $classSubject)
    {
        $this->authorize('view', $classSubject);

        return response()->json([
            'success' => true,
            'message' => 'Class subject retrieved successfully',
            'data' => new ClassSubjectResource($classSubject->load(['schoolClass', 'subject'])),
        ]);
    }

    /**
     * Update the specified class subject in storage.
     */
    public function update(UpdateClassSubjectRequest $request, ClassSubject $classSubject)
    {
        $this->authorize('update', $classSubject);

        try {
            $this->service->updateAssignmentStatus($classSubject, $request->get('is_active', true));

            return response()->json([
                'success' => true,
                'message' => 'Class subject updated successfully',
                'data' => new ClassSubjectResource($classSubject->load(['schoolClass', 'subject'])),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified class subject from storage.
     */
    public function destroy(ClassSubject $classSubject)
    {
        $this->authorize('delete', $classSubject);

        try {
            $this->service->removeAssignment($classSubject);

            return response()->json([
                'success' => true,
                'message' => 'Class subject removed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get subjects by class.
     */
    public function subjectsByClass(SchoolClass $schoolClass, Request $request)
    {
        $this->authorize('viewAny', ClassSubject::class);

        $classSubjects = ClassSubject::with(['subject'])
            ->where('school_class_id', $schoolClass->id);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $classSubjects->byStatus($request->status);
        }

        $classSubjects = $classSubjects->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Subjects for class retrieved successfully',
            'data' => ClassSubjectResource::collection($classSubjects),
        ]);
    }

    /**
     * Get classes by subject.
     */
    public function classesBySubject(Subject $subject, Request $request)
    {
        $this->authorize('viewAny', ClassSubject::class);

        $classSubjects = ClassSubject::with(['schoolClass'])
            ->where('subject_id', $subject->id);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $classSubjects->byStatus($request->status);
        }

        $classSubjects = $classSubjects->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Classes for subject retrieved successfully',
            'data' => ClassSubjectResource::collection($classSubjects),
        ]);
    }

    /**
     * Assign subject to class (shortcut endpoint).
     */
    public function assignSubject(SchoolClass $schoolClass, Subject $subject)
    {
        $this->authorize('create', ClassSubject::class);

        try {
            $classSubject = $this->service->assignSubjectToClass(
                $schoolClass->id,
                $subject->id,
                true
            );

            return response()->json([
                'success' => true,
                'message' => 'Subject assigned to class successfully',
                'data' => new ClassSubjectResource($classSubject->load(['schoolClass', 'subject'])),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove subject from class (shortcut endpoint).
     */
    public function removeSubject(SchoolClass $schoolClass, Subject $subject)
    {
        try {
            $classSubject = ClassSubject::where('school_class_id', $schoolClass->id)
                ->where('subject_id', $subject->id)
                ->whereNull('deleted_at')
                ->firstOrFail();

            $this->authorize('delete', $classSubject);

            $this->service->removeAssignment($classSubject);

            return response()->json([
                'success' => true,
                'message' => 'Subject removed from class successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
