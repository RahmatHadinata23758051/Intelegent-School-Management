<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\RiskScoreController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\TeacherProfileController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ClassSubjectController;
use App\Http\Controllers\Api\TeacherSubjectAssignmentController;
use App\Http\Controllers\Api\AttendanceSessionController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\GradeComponentController;
use App\Http\Controllers\Api\WeeklyGradeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public auth routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Academic Years CRUD
    Route::get('academic-years/active/current', [AcademicYearController::class, 'getActive']);
    Route::apiResource('academic-years', AcademicYearController::class);
    Route::post('academic-years/{academic_year}/activate', [AcademicYearController::class, 'activate']);

    // Semesters CRUD
    Route::get('semesters/active/current', [SemesterController::class, 'getActive']);
    Route::get('semesters/by-academic-year', [SemesterController::class, 'getByAcademicYear']);
    Route::apiResource('semesters', SemesterController::class);
    Route::post('semesters/{semester}/activate', [SemesterController::class, 'activate']);

    // Teacher Profiles CRUD
    Route::get('teachers/dropdown', [TeacherProfileController::class, 'dropdown']);
    Route::get('users/teacher-candidates', [TeacherProfileController::class, 'candidates']);
    Route::apiResource('teachers', TeacherProfileController::class);

    // Teacher Subject Assignments - Custom routes with explicit pattern
    Route::get('teachers/{id}/subjects', [TeacherSubjectAssignmentController::class, 'getSubjectsByTeacher'])->where('id', '[0-9]+');
    Route::get('teachers/{id}/classes', [TeacherSubjectAssignmentController::class, 'getClassesByTeacher'])->where('id', '[0-9]+');
    Route::post('teachers/{id}/class-subjects/{classSubjectId}', [TeacherSubjectAssignmentController::class, 'assignTeacherToClassSubject'])->where(['id' => '[0-9]+', 'classSubjectId' => '[0-9]+']);
    Route::delete('teachers/{id}/class-subjects/{classSubjectId}', [TeacherSubjectAssignmentController::class, 'removeTeacherFromClassSubject'])->where(['id' => '[0-9]+', 'classSubjectId' => '[0-9]+']);

    // Teacher Subject Assignments CRUD
    Route::apiResource('teacher-subject-assignments', TeacherSubjectAssignmentController::class);

    // Subjects CRUD
    Route::get('subjects/dropdown', [SubjectController::class, 'dropdown']);
    Route::apiResource('subjects', SubjectController::class);

    // Class Subjects CRUD
    Route::apiResource('class-subjects', ClassSubjectController::class);
    Route::get('classes/{schoolClass}/subjects', [ClassSubjectController::class, 'subjectsByClass']);
    Route::get('subjects/{subject}/classes', [ClassSubjectController::class, 'classesBySubject']);
    Route::post('classes/{schoolClass}/subjects/{subject}', [ClassSubjectController::class, 'assignSubject']);
    Route::delete('classes/{schoolClass}/subjects/{subject}', [ClassSubjectController::class, 'removeSubject']);

    // School Classes CRUD
    Route::apiResource('school-classes', SchoolClassController::class);

    // Students CRUD
    Route::apiResource('students', StudentController::class);

    // Risk Score endpoints
    Route::post('students/{student}/recalculate-risk', [RiskScoreController::class, 'recalculate']);
    Route::get('students/risk-level/{riskLevel}', [RiskScoreController::class, 'filterByRiskLevel']);

    // Grades nested under Students
    Route::prefix('students/{student}')->group(function () {
        Route::get('grades', [GradeController::class, 'index']);
        Route::post('grades', [GradeController::class, 'store']);
        Route::get('grades/{grade}', [GradeController::class, 'show']);
        Route::put('grades/{grade}', [GradeController::class, 'update']);
        Route::delete('grades/{grade}', [GradeController::class, 'destroy']);
    });

    // Violations nested under Students
    Route::prefix('students/{student}')->group(function () {
        Route::get('violations', [ViolationController::class, 'index']);
        Route::post('violations', [ViolationController::class, 'store']);
        Route::get('violations/{violation}', [ViolationController::class, 'show']);
        Route::put('violations/{violation}', [ViolationController::class, 'update']);
        Route::delete('violations/{violation}', [ViolationController::class, 'destroy']);
    });

    // Dashboard
    Route::get('dashboard/statistics', [DashboardController::class, 'statistics']);

    // Attendance Sessions
    Route::post('attendance-sessions/{attendanceSession}/lock', [AttendanceSessionController::class, 'lock']);
    Route::post('attendance-sessions/{attendanceSession}/unlock', [AttendanceSessionController::class, 'unlock']);
    Route::apiResource('attendance-sessions', AttendanceSessionController::class);

    // Attendances
    Route::get('attendance/summary', [AttendanceController::class, 'summary']);
    Route::get('classes/{schoolClass}/attendance', [AttendanceController::class, 'classAttendance']);
    Route::get('students/{student}/attendance', [AttendanceController::class, 'studentAttendance']);
    Route::post('attendance-sessions/{attendanceSession}/attendances/bulk', [AttendanceController::class, 'bulkStore']);
    Route::apiResource('attendances', AttendanceController::class);

    // Grade Components
    Route::get('grade-components/dropdown', [GradeComponentController::class, 'dropdown']);
    Route::get('grade-components/active', [GradeComponentController::class, 'active']);
    Route::apiResource('grade-components', GradeComponentController::class);

    // Weekly Grades
    Route::get('weekly-grades/summary', [WeeklyGradeController::class, 'summary']);
    Route::post('weekly-grades/bulk', [WeeklyGradeController::class, 'bulkStore']);
    Route::get('classes/{schoolClass}/weekly-grades', [WeeklyGradeController::class, 'classWeeklyGrades']);
    Route::get('students/{student}/weekly-grades', [WeeklyGradeController::class, 'studentWeeklyGrades']);
    Route::apiResource('weekly-grades', WeeklyGradeController::class);
});
