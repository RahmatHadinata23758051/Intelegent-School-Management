<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherProfile\StoreTeacherProfileRequest;
use App\Http\Requests\TeacherProfile\UpdateTeacherProfileRequest;
use App\Http\Resources\TeacherProfileResource;
use App\Http\Resources\UserResource;
use App\Models\TeacherProfile;
use App\Models\User;
use App\Services\TeacherProfileService;
use Illuminate\Http\Request;

class TeacherProfileController extends Controller
{
    protected $service;

    public function __construct(TeacherProfileService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of teacher profiles.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', TeacherProfile::class);

        $query = TeacherProfile::with('user');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($subQ) use ($search) {
                    $subQ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhere('nip', 'like', "%{$search}%")
                ->orWhere('specialization', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter status
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Filter role
        if ($request->has('role') && $request->role !== 'all') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->role);
            });
        }

        // Sort
        $sort = $request->get('sort', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSorts = ['id', 'nip', 'joined_date', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 15);
        $teacherProfiles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Teacher profiles retrieved successfully',
            'data' => TeacherProfileResource::collection($teacherProfiles->items()),
            'pagination' => [
                'total' => $teacherProfiles->total(),
                'per_page' => $teacherProfiles->perPage(),
                'current_page' => $teacherProfiles->currentPage(),
                'last_page' => $teacherProfiles->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created teacher profile in storage.
     */
    public function store(StoreTeacherProfileRequest $request)
    {
        $this->authorize('create', TeacherProfile::class);

        try {
            $teacherProfile = $this->service->createProfile($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Teacher profile created successfully',
                'data' => new TeacherProfileResource($teacherProfile->load('user')),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified teacher profile.
     */
    public function show(TeacherProfile $teacherProfile)
    {
        $this->authorize('view', $teacherProfile);

        return response()->json([
            'success' => true,
            'message' => 'Teacher profile retrieved successfully',
            'data' => new TeacherProfileResource($teacherProfile->load('user')),
        ]);
    }

    /**
     * Update the specified teacher profile in storage.
     */
    public function update(UpdateTeacherProfileRequest $request, TeacherProfile $teacherProfile)
    {
        $this->authorize('update', $teacherProfile);

        try {
            $this->service->updateProfile($teacherProfile, $request->validated());
            $teacherProfile->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Teacher profile updated successfully',
                'data' => new TeacherProfileResource($teacherProfile),
            ]);
        } catch (\Throwable $e) {
            \Log::error('TeacherProfile Update Error: ' . $e->getMessage(), [
                'exception' => $e,
                'teacherProfile' => $teacherProfile->id,
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified teacher profile from storage.
     */
    public function destroy(TeacherProfile $teacherProfile)
    {
        $this->authorize('delete', $teacherProfile);

        try {
            // Soft delete
            $teacherProfile->delete();

            return response()->json([
                'success' => true,
                'message' => 'Teacher profile deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get dropdown list of active teachers.
     */
    public function dropdown()
    {
        $this->authorize('viewAny', TeacherProfile::class);

        $teacherProfiles = $this->service->getDropdownList();

        return response()->json([
            'success' => true,
            'message' => 'Teacher dropdown retrieved successfully',
            'data' => TeacherProfileResource::collection($teacherProfiles),
        ]);
    }

    /**
     * Get user candidates untuk create teacher profile.
     */
    public function candidates()
    {
        $this->authorize('create', TeacherProfile::class);

        try {
            $candidates = $this->service->getUserCandidates();

            return response()->json([
                'success' => true,
                'message' => 'Teacher candidates retrieved successfully',
                'data' => UserResource::collection($candidates),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
