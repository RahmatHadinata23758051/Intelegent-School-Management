<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherSubjectAssignment\StoreTeacherSubjectAssignmentRequest;
use App\Http\Requests\TeacherSubjectAssignment\UpdateTeacherSubjectAssignmentRequest;
use App\Http\Resources\TeacherSubjectAssignmentResource;
use App\Models\ClassSubject;
use App\Models\TeacherProfile;
use App\Models\TeacherSubjectAssignment;
use App\Services\TeacherSubjectAssignmentService;
use Illuminate\Http\Request;

class TeacherSubjectAssignmentController extends Controller
{
    protected $service;

    public function __construct(TeacherSubjectAssignmentService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of teacher subject assignments.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', TeacherSubjectAssignment::class);

        $filters = $request->only([
            'search', 'teacher_name', 'teacher_email', 'teacher_nip',
            'class_name', 'subject_code', 'subject_name',
            'teacher_profile_id', 'school_class_id', 'subject_id',
            'class_subject_id', 'academic_year_id', 'is_active'
        ]);

        $pagination = [
            'page' => $request->get('page', 1),
            'per_page' => min($request->get('per_page', 15), 100),
        ];

        $sort = [
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_order' => $request->get('sort_order', 'asc'),
        ];

        $assignments = $this->service->getAssignments($filters, $pagination, $sort);

        return response()->json([
            'success' => true,
            'message' => 'Teacher subject assignments retrieved successfully',
            'data' => TeacherSubjectAssignmentResource::collection($assignments->items()),
            'pagination' => [
                'total' => $assignments->total(),
                'per_page' => $assignments->perPage(),
                'current_page' => $assignments->currentPage(),
                'last_page' => $assignments->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created teacher subject assignment in storage.
     */
    public function store(StoreTeacherSubjectAssignmentRequest $request)
    {
        $this->authorize('create', TeacherSubjectAssignment::class);

        try {
            $assignment = $this->service->createAssignment($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Teacher subject assignment created successfully',
                'data' => new TeacherSubjectAssignmentResource($assignment->load([
                    'teacherProfile.user',
                    'classSubject.schoolClass',
                    'classSubject.subject',
                    'academicYear',
                ])),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified teacher subject assignment.
     */
    public function show(TeacherSubjectAssignment $teacherSubjectAssignment)
    {
        $this->authorize('view', $teacherSubjectAssignment);

        return response()->json([
            'success' => true,
            'message' => 'Teacher subject assignment retrieved successfully',
            'data' => new TeacherSubjectAssignmentResource($teacherSubjectAssignment->load([
                'teacherProfile.user',
                'classSubject.schoolClass',
                'classSubject.subject',
                'academicYear',
            ])),
        ]);
    }

    /**
     * Update the specified teacher subject assignment in storage.
     */
    public function update(UpdateTeacherSubjectAssignmentRequest $request, TeacherSubjectAssignment $teacherSubjectAssignment)
    {
        $this->authorize('update', $teacherSubjectAssignment);

        try {
            $updated = $this->service->updateAssignment($teacherSubjectAssignment->id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Teacher subject assignment updated successfully',
                'data' => new TeacherSubjectAssignmentResource($updated),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified teacher subject assignment from storage.
     */
    public function destroy(TeacherSubjectAssignment $teacherSubjectAssignment)
    {
        $this->authorize('delete', $teacherSubjectAssignment);

        try {
            $this->service->deleteAssignment($teacherSubjectAssignment->id);

            return response()->json([
                'success' => true,
                'message' => 'Teacher subject assignment removed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get subjects taught by teacher.
     */
    public function getSubjectsByTeacher(TeacherProfile $teacher, Request $request)
    {
        $this->authorize('viewAny', TeacherSubjectAssignment::class);

        try {
            $academicYearId = $request->get('academic_year_id');
            $subjects = $this->service->getSubjectsByTeacher($teacher->id, $academicYearId);

            return response()->json([
                'success' => true,
                'message' => 'Subjects taught by teacher retrieved successfully',
                'data' => $subjects->map(function ($subject) {
                    return [
                        'id' => $subject->id,
                        'code' => $subject->code,
                        'name' => $subject->name,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get classes taught by teacher.
     */
    public function getClassesByTeacher(TeacherProfile $teacher, Request $request)
    {
        $this->authorize('viewAny', TeacherSubjectAssignment::class);

        try {
            $academicYearId = $request->get('academic_year_id');
            $classes = $this->service->getClassesByTeacher($teacher->id, $academicYearId);

            return response()->json([
                'success' => true,
                'message' => 'Classes taught by teacher retrieved successfully',
                'data' => $classes->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'name' => $class->name,
                        'grade_level' => $class->grade_level,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Assign teacher to class-subject.
     */
    public function assignTeacherToClassSubject(
        TeacherProfile $teacher,
        ClassSubject $classSubject,
        Request $request
    ) {
        $this->authorize('create', TeacherSubjectAssignment::class);

        try {
            $academicYearId = $request->get('academic_year_id');

            if (!$academicYearId) {
                return response()->json([
                    'success' => false,
                    'message' => 'academic_year_id wajib diisi',
                ], 422);
            }

            $assignment = $this->service->assignTeacherToClassSubject(
                $teacher->id,
                $classSubject->id,
                $academicYearId
            );

            return response()->json([
                'success' => true,
                'message' => 'Teacher assigned to class-subject successfully',
                'data' => new TeacherSubjectAssignmentResource($assignment->load([
                    'teacherProfile.user',
                    'classSubject.schoolClass',
                    'classSubject.subject',
                    'academicYear',
                ])),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove teacher from class-subject.
     */
    public function removeTeacherFromClassSubject(
        TeacherProfile $teacher,
        ClassSubject $classSubject,
        Request $request
    ) {
        $this->authorize('delete', TeacherSubjectAssignment::class);

        try {
            $academicYearId = $request->get('academic_year_id');

            if (!$academicYearId) {
                return response()->json([
                    'success' => false,
                    'message' => 'academic_year_id wajib diisi',
                ], 422);
            }

            $this->service->removeTeacherFromClassSubject(
                $teacher->id,
                $classSubject->id,
                $academicYearId
            );

            return response()->json([
                'success' => true,
                'message' => 'Teacher removed from class-subject successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
