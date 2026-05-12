<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\BulkStoreAttendanceRequest;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Services\AttendanceService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    use ApiResponse;

    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->middleware('auth:sanctum');
        $this->attendanceService = $attendanceService;
    }

    /**
     * Display a listing of attendances
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $query = Attendance::with(['student', 'attendanceSession.schoolClass', 'recordedBy']);

        // Filter by attendance_session_id
        if ($request->filled('attendance_session_id')) {
            $query->where('attendance_session_id', $request->attendance_session_id);
        }

        // Filter by student_id
        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by school_class_id through session
        if ($request->filled('school_class_id')) {
            $query->whereHas('attendanceSession', function ($q) use ($request) {
                $q->where('school_class_id', $request->school_class_id);
            });
        }

        // Filter by academic_year_id through session
        if ($request->filled('academic_year_id')) {
            $query->whereHas('attendanceSession', function ($q) use ($request) {
                $q->where('academic_year_id', $request->academic_year_id);
            });
        }

        // Filter by semester_id through session
        if ($request->filled('semester_id')) {
            $query->whereHas('attendanceSession', function ($q) use ($request) {
                $q->where('semester_id', $request->semester_id);
            });
        }

        // Filter by date range through session
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereHas('attendanceSession', function ($q) use ($request) {
                $q->whereBetween('session_date', [$request->date_from, $request->date_to]);
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $attendances = $query->paginate($perPage);

        return $this->successResponse(
            [
                'data' => AttendanceResource::collection($attendances),
                'meta' => [
                    'total' => $attendances->total(),
                    'per_page' => $attendances->perPage(),
                    'current_page' => $attendances->currentPage(),
                    'last_page' => $attendances->lastPage(),
                ]
            ],
            'Data absensi berhasil diambil'
        );
    }

    /**
     * Store a newly created attendance
     */
    public function store(StoreAttendanceRequest $request)
    {
        $this->authorize('create', Attendance::class);

        $attendance = Attendance::create([
            ...$request->validated(),
            'recorded_by' => auth()->id(),
            'recorded_at' => now(),
        ]);

        $attendance->load(['student', 'attendanceSession', 'recordedBy']);

        return $this->successResponse(
            new AttendanceResource($attendance),
            'Absensi berhasil dicatat',
            [],
            201
        );
    }

    /**
     * Bulk store attendances for a session
     */
    public function bulkStore(BulkStoreAttendanceRequest $request, AttendanceSession $attendanceSession)
    {
        $this->authorize('create', Attendance::class);

        $results = $this->attendanceService->bulkUpsertAttendances(
            $attendanceSession,
            $request->attendances,
            auth()->id()
        );

        $attendances = Attendance::where('attendance_session_id', $attendanceSession->id)
            ->with(['student', 'recordedBy'])
            ->get();

        return $this->successResponse(
            AttendanceResource::collection($attendances),
            "Absensi berhasil disimpan. {$results['created']} dibuat, {$results['updated']} diperbarui.",
            $results
        );
    }

    /**
     * Display the specified attendance
     */
    public function show(Attendance $attendance)
    {
        $this->authorize('view', $attendance);

        $attendance->load(['student', 'attendanceSession.schoolClass', 'recordedBy']);

        return $this->successResponse(
            new AttendanceResource($attendance),
            'Detail absensi berhasil diambil'
        );
    }

    /**
     * Update the specified attendance
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $this->authorize('update', $attendance);

        $attendance->update([
            ...$request->validated(),
            'recorded_by' => auth()->id(),
            'recorded_at' => now(),
        ]);

        $attendance->load(['student', 'attendanceSession', 'recordedBy']);

        return $this->successResponse(
            new AttendanceResource($attendance),
            'Absensi berhasil diperbarui'
        );
    }

    /**
     * Remove the specified attendance
     */
    public function destroy(Attendance $attendance)
    {
        $this->authorize('delete', $attendance);

        if ($attendance->attendanceSession->is_locked) {
            return $this->errorResponse('Absensi dari sesi terkunci tidak dapat dihapus', 422);
        }

        $attendance->delete();

        return $this->successResponse(
            null,
            'Absensi berhasil dihapus'
        );
    }

    /**
     * Get class attendance recap
     */
    public function classAttendance(Request $request, SchoolClass $schoolClass)
    {
        $this->authorize('viewAny', Attendance::class);

        $recap = $this->attendanceService->getClassAttendanceRecap(
            $schoolClass->id,
            $request->academic_year_id,
            $request->semester_id,
            $request->date_from,
            $request->date_to
        );

        return $this->successResponse(
            $recap,
            'Rekap absensi kelas berhasil diambil'
        );
    }

    /**
     * Get student attendance recap
     */
    public function studentAttendance(Request $request, Student $student)
    {
        $this->authorize('viewAny', Attendance::class);

        $recap = $this->attendanceService->calculateAttendanceRate(
            $student->id,
            $request->academic_year_id,
            $request->semester_id,
            $request->date_from,
            $request->date_to
        );

        return $this->successResponse(
            [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'student_id' => $student->student_id,
                    'email' => $student->email,
                ],
                'attendance' => $recap,
            ],
            'Rekap absensi siswa berhasil diambil'
        );
    }

    /**
     * Get attendance summary
     */
    public function summary(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $summary = $this->attendanceService->getAttendanceSummary(
            $request->academic_year_id,
            $request->semester_id
        );

        return $this->successResponse(
            $summary,
            'Ringkasan absensi berhasil diambil'
        );
    }
}
