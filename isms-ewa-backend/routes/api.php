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
});
