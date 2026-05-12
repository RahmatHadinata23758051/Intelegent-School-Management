<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttendanceSession\StoreAttendanceSessionRequest;
use App\Http\Requests\AttendanceSession\UpdateAttendanceSessionRequest;
use App\Http\Resources\AttendanceSessionResource;
use App\Models\AttendanceSession;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AttendanceSessionController extends Controller
{
    use ApiResponse;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of attendance sessions
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', AttendanceSession::class);

        $query = AttendanceSession::with(['schoolClass', 'academicYear', 'semester', 'createdBy']);

        // Filter by school_class_id
        if ($request->filled('school_class_id')) {
            $query->where('school_class_id', $request->school_class_id);
        }

        // Filter by academic_year_id
        if ($request->filled('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }

        // Filter by semester_id
        if ($request->filled('semester_id')) {
            $query->where('semester_id', $request->semester_id);
        }

        // Filter by session_date
        if ($request->filled('session_date')) {
            $query->whereDate('session_date', $request->session_date);
        }

        // Filter by date range
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('session_date', [$request->date_from, $request->date_to]);
        }

        // Filter by locked status
        if ($request->filled('status')) {
            if ($request->status === 'locked') {
                $query->where('is_locked', true);
            } elseif ($request->status === 'unlocked') {
                $query->where('is_locked', false);
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('schoolClass', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'session_date');
        $sortDir = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $sessions = $query->paginate($perPage);

        return $this->successResponse(
            AttendanceSessionResource::collection($sessions),
            'Sesi absensi berhasil diambil',
            [
                'pagination' => [
                    'total' => $sessions->total(),
                    'per_page' => $sessions->perPage(),
                    'current_page' => $sessions->currentPage(),
                    'last_page' => $sessions->lastPage(),
                ]
            ]
        );
    }

    /**
     * Store a newly created attendance session
     */
    public function store(StoreAttendanceSessionRequest $request)
    {
        $this->authorize('create', AttendanceSession::class);

        $session = AttendanceSession::create([
            ...$request->validated(),
            'created_by' => auth()->id(),
            'session_type' => $request->session_type ?? 'daily',
        ]);

        $session->load(['schoolClass', 'academicYear', 'semester', 'createdBy']);

        return $this->successResponse(
            new AttendanceSessionResource($session),
            'Sesi absensi berhasil dibuat',
            [],
            201
        );
    }

    /**
     * Display the specified attendance session
     */
    public function show(AttendanceSession $attendanceSession)
    {
        $this->authorize('view', $attendanceSession);

        $attendanceSession->load(['schoolClass', 'academicYear', 'semester', 'createdBy', 'attendances.student']);

        return $this->successResponse(
            new AttendanceSessionResource($attendanceSession),
            'Detail sesi absensi berhasil diambil'
        );
    }

    /**
     * Update the specified attendance session
     */
    public function update(UpdateAttendanceSessionRequest $request, AttendanceSession $attendanceSession)
    {
        $this->authorize('update', $attendanceSession);

        $attendanceSession->update($request->validated());
        $attendanceSession->load(['schoolClass', 'academicYear', 'semester', 'createdBy']);

        return $this->successResponse(
            new AttendanceSessionResource($attendanceSession),
            'Sesi absensi berhasil diperbarui'
        );
    }

    /**
     * Remove the specified attendance session
     */
    public function destroy(AttendanceSession $attendanceSession)
    {
        $this->authorize('delete', $attendanceSession);

        if ($attendanceSession->is_locked) {
            return $this->errorResponse('Sesi absensi terkunci tidak dapat dihapus', 422);
        }

        $attendanceSession->delete();

        return $this->successResponse(
            null,
            'Sesi absensi berhasil dihapus'
        );
    }

    /**
     * Lock attendance session
     */
    public function lock(AttendanceSession $attendanceSession)
    {
        $this->authorize('update', $attendanceSession);

        $attendanceSession->update(['is_locked' => true]);

        return $this->successResponse(
            new AttendanceSessionResource($attendanceSession),
            'Sesi absensi berhasil dikunci'
        );
    }

    /**
     * Unlock attendance session
     */
    public function unlock(AttendanceSession $attendanceSession)
    {
        $this->authorize('unlock', $attendanceSession);

        $attendanceSession->update(['is_locked' => false]);

        return $this->successResponse(
            new AttendanceSessionResource($attendanceSession),
            'Sesi absensi berhasil dibuka'
        );
    }
}
