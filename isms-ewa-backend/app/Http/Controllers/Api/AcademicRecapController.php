<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicRecap\GenerateAcademicSummaryRequest;
use App\Http\Resources\StudentAcademicSummaryResource;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\StudentAcademicSummary;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Services\AcademicRecapService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AcademicRecapController extends Controller
{
    use ApiResponse;
    
    protected $academicRecapService;
    
    public function __construct(AcademicRecapService $academicRecapService)
    {
        $this->academicRecapService = $academicRecapService;
    }
    
    /**
     * List academic summaries with filters
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', StudentAcademicSummary::class);
        
        $query = StudentAcademicSummary::with([
            'student',
            'schoolClass',
            'academicYear',
            'semester',
            'generatedBy'
        ]);
        
        // Apply filters
        if ($request->filled('student_id')) {
            $query->forStudent($request->student_id);
        }
        
        if ($request->filled('school_class_id')) {
            $query->forClass($request->school_class_id);
        }
        
        if ($request->filled('academic_year_id')) {
            $query->forAcademicYear($request->academic_year_id);
        }
        
        if ($request->filled('semester_id')) {
            $query->forSemester($request->semester_id);
        }
        
        if ($request->filled('academic_status')) {
            $query->byAcademicStatus($request->academic_status);
        }
        
        if ($request->filled('overall_status')) {
            $query->byOverallStatus($request->overall_status);
        }
        
        if ($request->boolean('with_low_scores')) {
            $query->withLowScores();
        }
        
        if ($request->boolean('with_poor_attendance')) {
            $query->withPoorAttendance();
        }
        
        if ($request->boolean('with_violations')) {
            $query->withViolations();
        }
        
        $perPage = $request->input('per_page', 15);
        $summaries = $query->latest('generated_at')->paginate($perPage);
        
        return $this->successResponse(
            [
                'data' => StudentAcademicSummaryResource::collection($summaries),
                'meta' => [
                    'current_page' => $summaries->currentPage(),
                    'last_page' => $summaries->lastPage(),
                    'per_page' => $summaries->perPage(),
                    'total' => $summaries->total(),
                ],
            ],
            'Daftar rekap akademik berhasil diambil'
        );
    }
    
    /**
     * Generate academic summary for student or class
     */
    public function generateSummary(GenerateAcademicSummaryRequest $request)
    {
        $this->authorize('create', StudentAcademicSummary::class);
        
        $validated = $request->validated();
        $academicYear = AcademicYear::findOrFail($validated['academic_year_id']);
        $semester = Semester::findOrFail($validated['semester_id']);
        $generatedBy = auth()->id();
        
        if (isset($validated['student_id'])) {
            // Generate for single student
            $student = Student::findOrFail($validated['student_id']);
            $summary = $this->academicRecapService->generateStudentSummary(
                $student,
                $academicYear,
                $semester,
                $generatedBy
            );
            
            $summary->load(['student', 'schoolClass', 'academicYear', 'semester', 'generatedBy']);
            
            return $this->successResponse(
                new StudentAcademicSummaryResource($summary),
                'Rekap akademik siswa berhasil dibuat',
                201
            );
        } elseif (isset($validated['school_class_id'])) {
            // Generate for class
            $schoolClass = SchoolClass::findOrFail($validated['school_class_id']);
            $summaries = $this->academicRecapService->generateClassSummary(
                $schoolClass,
                $academicYear,
                $semester,
                $generatedBy
            );
            
            foreach ($summaries as $summary) {
                $summary->load(['student', 'schoolClass', 'academicYear', 'semester', 'generatedBy']);
            }
            
            return $this->successResponse(
                [
                    'data' => StudentAcademicSummaryResource::collection($summaries),
                    'count' => count($summaries),
                ],
                'Rekap akademik kelas berhasil dibuat',
                201
            );
        }
        
        return $this->errorResponse('Student ID atau Class ID harus diisi', null, 400);
    }
    
    /**
     * Show single academic summary
     */
    public function show(StudentAcademicSummary $studentAcademicSummary)
    {
        $this->authorize('view', $studentAcademicSummary);
        
        $studentAcademicSummary->load([
            'student',
            'schoolClass',
            'academicYear',
            'semester',
            'generatedBy',
            'reportCard'
        ]);
        
        return $this->successResponse(
            new StudentAcademicSummaryResource($studentAcademicSummary),
            'Detail rekap akademik berhasil diambil'
        );
    }
    
    /**
     * Get academic summary for specific student
     */
    public function getStudentSummary(Request $request, Student $student)
    {
        $this->authorize('view', $student);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        $query = StudentAcademicSummary::where('student_id', $student->id)
            ->with(['student', 'schoolClass', 'academicYear', 'semester', 'generatedBy']);
        
        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }
        
        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }
        
        $summary = $query->latest('generated_at')->first();
        
        if (!$summary) {
            return $this->notFoundResponse('Rekap akademik tidak ditemukan');
        }
        
        return $this->successResponse(
            new StudentAcademicSummaryResource($summary),
            'Rekap akademik siswa berhasil diambil'
        );
    }
    
    /**
     * Get academic summaries for class
     */
    public function getClassSummaries(Request $request, SchoolClass $schoolClass)
    {
        $this->authorize('viewAny', StudentAcademicSummary::class);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        $query = StudentAcademicSummary::where('school_class_id', $schoolClass->id)
            ->with(['student', 'schoolClass', 'academicYear', 'semester', 'generatedBy']);
        
        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }
        
        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }
        
        $summaries = $query->latest('generated_at')->get();
        
        return $this->successResponse(
            [
                'data' => StudentAcademicSummaryResource::collection($summaries),
                'count' => $summaries->count(),
            ],
            'Rekap akademik kelas berhasil diambil'
        );
    }
    
    /**
     * Get subject grade breakdown for preview
     */
    public function getSubjectBreakdown(Request $request, Student $student)
    {
        $this->authorize('view', $student);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        if (!$academicYearId || !$semesterId) {
            return $this->errorResponse('Academic Year ID dan Semester ID harus diisi', null, 400);
        }
        
        $academicYear = AcademicYear::findOrFail($academicYearId);
        $semester = Semester::findOrFail($semesterId);
        
        $breakdown = $this->academicRecapService->getSubjectGradeBreakdown($student, $academicYear, $semester);
        
        return $this->successResponse(
            $breakdown,
            'Breakdown nilai mata pelajaran berhasil diambil'
        );
    }
    
    /**
     * Get attendance recap for preview
     */
    public function getAttendanceRecap(Request $request, Student $student)
    {
        $this->authorize('view', $student);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        if (!$academicYearId || !$semesterId) {
            return $this->errorResponse('Academic Year ID dan Semester ID harus diisi', null, 400);
        }
        
        $academicYear = AcademicYear::findOrFail($academicYearId);
        $semester = Semester::findOrFail($semesterId);
        
        $recap = $this->academicRecapService->getAttendanceRecap($student, $academicYear, $semester);
        
        return $this->successResponse(
            $recap,
            'Rekap absensi berhasil diambil'
        );
    }
    
    /**
     * Get violation recap for preview
     */
    public function getViolationRecap(Request $request, Student $student)
    {
        $this->authorize('view', $student);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        if (!$academicYearId || !$semesterId) {
            return $this->errorResponse('Academic Year ID dan Semester ID harus diisi', null, 400);
        }
        
        $academicYear = AcademicYear::findOrFail($academicYearId);
        $semester = Semester::findOrFail($semesterId);
        
        $recap = $this->academicRecapService->getViolationRecap($student, $academicYear, $semester);
        
        // Remove full violation objects for preview
        unset($recap['violations']);
        
        return $this->successResponse(
            $recap,
            'Rekap pelanggaran berhasil diambil'
        );
    }
}
