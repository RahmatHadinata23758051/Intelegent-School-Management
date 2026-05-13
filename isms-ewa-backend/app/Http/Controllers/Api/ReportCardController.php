<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportCard\GenerateReportCardRequest;
use App\Http\Requests\ReportCard\UpdateReportCardRequest;
use App\Http\Resources\ReportCardResource;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\ReportCard;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Services\ReportCardService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ReportCardController extends Controller
{
    use ApiResponse;
    
    protected $reportCardService;
    
    public function __construct(ReportCardService $reportCardService)
    {
        $this->reportCardService = $reportCardService;
    }
    
    /**
     * List report cards with filters
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ReportCard::class);
        
        $query = ReportCard::with([
            'student',
            'schoolClass',
            'academicYear',
            'semester',
            'studentAcademicSummary',
            'generatedBy',
            'approvedBy'
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
        
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }
        
        $perPage = $request->input('per_page', 15);
        $reportCards = $query->latest('generated_at')->paginate($perPage);
        
        return $this->successResponse(
            [
                'data' => ReportCardResource::collection($reportCards),
                'meta' => [
                    'current_page' => $reportCards->currentPage(),
                    'last_page' => $reportCards->lastPage(),
                    'per_page' => $reportCards->perPage(),
                    'total' => $reportCards->total(),
                ],
            ],
            'Daftar raport berhasil diambil'
        );
    }
    
    /**
     * Generate report card for student or class
     */
    public function generateReportCard(GenerateReportCardRequest $request)
    {
        $this->authorize('create', ReportCard::class);
        
        $validated = $request->validated();
        $academicYear = AcademicYear::findOrFail($validated['academic_year_id']);
        $semester = Semester::findOrFail($validated['semester_id']);
        $generatedBy = auth()->id();
        
        if (isset($validated['student_id'])) {
            // Generate for single student
            $student = Student::with('schoolClass')->findOrFail($validated['student_id']);
            $reportCard = $this->reportCardService->generateReportCard(
                $student,
                $academicYear,
                $semester,
                $generatedBy
            );
            
            $reportCard->load([
                'student',
                'schoolClass',
                'academicYear',
                'semester',
                'studentAcademicSummary',
                'generatedBy'
            ]);
            
            return $this->successResponse(
                new ReportCardResource($reportCard),
                'Raport siswa berhasil dibuat',
                201
            );
        } elseif (isset($validated['school_class_id'])) {
            // Generate for class
            $schoolClass = SchoolClass::with('students')->findOrFail($validated['school_class_id']);
            $reportCards = [];
            
            foreach ($schoolClass->students as $student) {
                $reportCard = $this->reportCardService->generateReportCard(
                    $student,
                    $academicYear,
                    $semester,
                    $generatedBy
                );
                
                $reportCard->load([
                    'student',
                    'schoolClass',
                    'academicYear',
                    'semester',
                    'studentAcademicSummary',
                    'generatedBy'
                ]);
                
                $reportCards[] = $reportCard;
            }
            
            return $this->successResponse(
                [
                    'data' => ReportCardResource::collection($reportCards),
                    'count' => count($reportCards),
                ],
                'Raport kelas berhasil dibuat',
                201
            );
        }
        
        return $this->errorResponse('Student ID atau Class ID harus diisi', null, 400);
    }
    
    /**
     * Show single report card
     */
    public function show(ReportCard $reportCard)
    {
        $this->authorize('view', $reportCard);
        
        $reportCard->load([
            'student',
            'schoolClass',
            'academicYear',
            'semester',
            'studentAcademicSummary',
            'generatedBy',
            'reviewedBy',
            'approvedBy'
        ]);
        
        return $this->successResponse(
            new ReportCardResource($reportCard),
            'Detail raport berhasil diambil'
        );
    }
    
    /**
     * Update report card notes
     */
    public function update(UpdateReportCardRequest $request, ReportCard $reportCard)
    {
        $this->authorize('update', $reportCard);
        
        if (!$reportCard->can_be_edited) {
            return $this->errorResponse('Raport tidak dapat diubah karena sudah disetujui', null, 400);
        }
        
        $reportCard = $this->reportCardService->updateReportCardNotes($reportCard, $request->validated());
        
        $reportCard->load([
            'student',
            'schoolClass',
            'academicYear',
            'semester',
            'studentAcademicSummary',
            'generatedBy'
        ]);
        
        return $this->successResponse(
            new ReportCardResource($reportCard),
            'Catatan raport berhasil diperbarui'
        );
    }
    
    /**
     * Approve report card
     */
    public function approve(ReportCard $reportCard)
    {
        $this->authorize('approve', $reportCard);
        
        if (!$reportCard->can_be_approved) {
            return $this->errorResponse('Raport tidak dapat disetujui', null, 400);
        }
        
        $reportCard = $this->reportCardService->approveReportCard($reportCard, auth()->id());
        
        $reportCard->load([
            'student',
            'schoolClass',
            'academicYear',
            'semester',
            'studentAcademicSummary',
            'generatedBy',
            'approvedBy'
        ]);
        
        return $this->successResponse(
            new ReportCardResource($reportCard),
            'Raport berhasil disetujui'
        );
    }
    
    /**
     * Get report card for specific student
     */
    public function getStudentReportCard(Request $request, Student $student)
    {
        $this->authorize('view', $student);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        $query = ReportCard::where('student_id', $student->id)
            ->with([
                'student',
                'schoolClass',
                'academicYear',
                'semester',
                'studentAcademicSummary',
                'generatedBy',
                'approvedBy'
            ]);
        
        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }
        
        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }
        
        $reportCard = $query->latest('generated_at')->first();
        
        if (!$reportCard) {
            return $this->notFoundResponse('Raport tidak ditemukan');
        }
        
        return $this->successResponse(
            new ReportCardResource($reportCard),
            'Raport siswa berhasil diambil'
        );
    }
    
    /**
     * Get report cards for class
     */
    public function getClassReportCards(Request $request, SchoolClass $schoolClass)
    {
        $this->authorize('viewAny', ReportCard::class);
        
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        
        $query = ReportCard::where('school_class_id', $schoolClass->id)
            ->with([
                'student',
                'schoolClass',
                'academicYear',
                'semester',
                'studentAcademicSummary',
                'generatedBy',
                'approvedBy'
            ]);
        
        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }
        
        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }
        
        $reportCards = $query->latest('generated_at')->get();
        
        return $this->successResponse(
            [
                'data' => ReportCardResource::collection($reportCards),
                'count' => $reportCards->count(),
            ],
            'Raport kelas berhasil diambil'
        );
    }
}
