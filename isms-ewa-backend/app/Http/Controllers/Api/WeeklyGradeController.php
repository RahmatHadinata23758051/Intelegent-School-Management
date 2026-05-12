<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WeeklyGrade\BulkStoreWeeklyGradeRequest;
use App\Http\Requests\WeeklyGrade\StoreWeeklyGradeRequest;
use App\Http\Requests\WeeklyGrade\UpdateWeeklyGradeRequest;
use App\Http\Resources\WeeklyGradeResource;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\WeeklyGrade;
use App\Services\WeeklyGradeService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class WeeklyGradeController extends Controller
{
    use ApiResponse;

    protected WeeklyGradeService $weeklyGradeService;

    public function __construct(WeeklyGradeService $weeklyGradeService)
    {
        $this->middleware('auth:sanctum');
        $this->weeklyGradeService = $weeklyGradeService;
    }

    /**
     * Display a listing of weekly grades
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', WeeklyGrade::class);

        $query = WeeklyGrade::with([
            'student',
            'teacherSubjectAssignment.teacherProfile',
            'teacherSubjectAssignment.classSubject.schoolClass',
            'teacherSubjectAssignment.classSubject.subject',
            'gradeComponent',
            'academicYear',
            'semester',
            'recordedBy',
        ]);

        // Apply filters
        $query->byStudent($request->student_id)
            ->byTeacherAssignment($request->teacher_subject_assignment_id)
            ->byClass($request->school_class_id)
            ->bySubject($request->subject_id)
            ->byTeacher($request->teacher_profile_id)
            ->byGradeComponent($request->grade_component_id)
            ->byAcademicYear($request->academic_year_id)
            ->bySemester($request->semester_id)
            ->byWeek($request->week_number)
            ->byDateRange($request->date_from, $request->date_to)
            ->byScoreRange($request->min_score, $request->max_score);

        // Search by student name
        if ($request->filled('search')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('student_id', 'like', "%{$request->search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $weeklyGrades = $query->paginate($perPage);

        return $this->successResponse(
            [
                'data' => WeeklyGradeResource::collection($weeklyGrades),
                'meta' => [
                    'total' => $weeklyGrades->total(),
                    'per_page' => $weeklyGrades->perPage(),
                    'current_page' => $weeklyGrades->currentPage(),
                    'last_page' => $weeklyGrades->lastPage(),
                ]
            ],
            'Data nilai mingguan berhasil diambil'
        );
    }

    /**
     * Get weekly grades summary
     */
    public function summary(Request $request)
    {
        $this->authorize('viewAny', WeeklyGrade::class);

        $summary = $this->weeklyGradeService->getWeeklyGradesSummary([
            'academic_year_id' => $request->academic_year_id,
            'semester_id' => $request->semester_id,
        ]);

        return $this->successResponse(
            $summary,
            'Ringkasan nilai mingguan berhasil diambil'
        );
    }

    /**
     * Store a newly created weekly grade
     */
    public function store(StoreWeeklyGradeRequest $request)
    {
        $this->authorize('create', WeeklyGrade::class);

        // Additional authorization: teacher can only input for their assignments
        if (auth()->user()->role !== 'admin') {
            $teacherProfile = auth()->user()->teacherProfile;
            $assignment = \App\Models\TeacherSubjectAssignment::find($request->teacher_subject_assignment_id);
            
            if (!$teacherProfile || $assignment->teacher_profile_id !== $teacherProfile->id) {
                return $this->errorResponse('Anda tidak memiliki akses untuk assignment ini', 403);
            }
        }

        $weeklyGrade = WeeklyGrade::create([
            ...$request->validated(),
            'recorded_by' => auth()->id(),
        ]);

        $weeklyGrade->load([
            'student',
            'teacherSubjectAssignment.teacherProfile',
            'teacherSubjectAssignment.classSubject.schoolClass',
            'teacherSubjectAssignment.classSubject.subject',
            'gradeComponent',
            'academicYear',
            'semester',
            'recordedBy',
        ]);

        return $this->successResponse(
            new WeeklyGradeResource($weeklyGrade),
            'Nilai mingguan berhasil disimpan',
            201
        );
    }

    /**
     * Bulk store weekly grades
     */
    public function bulkStore(BulkStoreWeeklyGradeRequest $request)
    {
        $this->authorize('create', WeeklyGrade::class);

        // Additional authorization: teacher can only input for their assignments
        if (auth()->user()->role !== 'admin') {
            $teacherProfile = auth()->user()->teacherProfile;
            $assignment = \App\Models\TeacherSubjectAssignment::find($request->teacher_subject_assignment_id);
            
            if (!$teacherProfile || $assignment->teacher_profile_id !== $teacherProfile->id) {
                return $this->errorResponse('Anda tidak memiliki akses untuk assignment ini', 403);
            }
        }

        $results = $this->weeklyGradeService->bulkUpsertWeeklyGrades(
            $request->validated(),
            auth()->id()
        );

        // Load the grades
        $weeklyGrades = WeeklyGrade::with([
            'student',
            'gradeComponent',
        ])
            ->where('teacher_subject_assignment_id', $request->teacher_subject_assignment_id)
            ->where('grade_component_id', $request->grade_component_id)
            ->where('academic_year_id', $request->academic_year_id)
            ->where('semester_id', $request->semester_id)
            ->where('week_number', $request->week_number)
            ->get();

        return $this->successResponse(
            [
                'data' => WeeklyGradeResource::collection($weeklyGrades),
                'meta' => $results,
            ],
            "Nilai mingguan berhasil disimpan. {$results['created']} dibuat, {$results['updated']} diperbarui."
        );
    }

    /**
     * Display the specified weekly grade
     */
    public function show(WeeklyGrade $weeklyGrade)
    {
        $this->authorize('view', $weeklyGrade);

        $weeklyGrade->load([
            'student',
            'teacherSubjectAssignment.teacherProfile',
            'teacherSubjectAssignment.classSubject.schoolClass',
            'teacherSubjectAssignment.classSubject.subject',
            'gradeComponent',
            'academicYear',
            'semester',
            'recordedBy',
        ]);

        return $this->successResponse(
            new WeeklyGradeResource($weeklyGrade),
            'Detail nilai mingguan berhasil diambil'
        );
    }

    /**
     * Update the specified weekly grade
     */
    public function update(UpdateWeeklyGradeRequest $request, WeeklyGrade $weeklyGrade)
    {
        $this->authorize('update', $weeklyGrade);

        $weeklyGrade->update([
            ...$request->validated(),
            'recorded_by' => auth()->id(),
        ]);

        $weeklyGrade->load([
            'student',
            'teacherSubjectAssignment.teacherProfile',
            'teacherSubjectAssignment.classSubject.schoolClass',
            'teacherSubjectAssignment.classSubject.subject',
            'gradeComponent',
            'academicYear',
            'semester',
            'recordedBy',
        ]);

        return $this->successResponse(
            new WeeklyGradeResource($weeklyGrade),
            'Nilai mingguan berhasil diperbarui'
        );
    }

    /**
     * Remove the specified weekly grade
     */
    public function destroy(WeeklyGrade $weeklyGrade)
    {
        $this->authorize('delete', $weeklyGrade);

        // Soft delete to preserve history
        $weeklyGrade->delete();

        return $this->successResponse(
            null,
            'Nilai mingguan berhasil dihapus'
        );
    }

    /**
     * Get class weekly grades recap
     */
    public function classWeeklyGrades(Request $request, SchoolClass $schoolClass)
    {
        $this->authorize('viewAny', WeeklyGrade::class);

        $recap = $this->weeklyGradeService->getClassWeeklyGradesRecap(
            $schoolClass->id,
            [
                'subject_id' => $request->subject_id,
                'teacher_profile_id' => $request->teacher_profile_id,
                'grade_component_id' => $request->grade_component_id,
                'academic_year_id' => $request->academic_year_id,
                'semester_id' => $request->semester_id,
                'week_number' => $request->week_number,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ]
        );

        return $this->successResponse(
            $recap,
            'Rekap nilai mingguan kelas berhasil diambil'
        );
    }

    /**
     * Get student weekly grades recap
     */
    public function studentWeeklyGrades(Request $request, Student $student)
    {
        $this->authorize('viewAny', WeeklyGrade::class);

        $recap = $this->weeklyGradeService->getStudentWeeklyGradesRecap(
            $student->id,
            [
                'subject_id' => $request->subject_id,
                'grade_component_id' => $request->grade_component_id,
                'academic_year_id' => $request->academic_year_id,
                'semester_id' => $request->semester_id,
                'week_number' => $request->week_number,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ]
        );

        return $this->successResponse(
            [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'student_id' => $student->student_id,
                    'email' => $student->email,
                ],
                'grades' => $recap,
            ],
            'Rekap nilai mingguan siswa berhasil diambil'
        );
    }
}
