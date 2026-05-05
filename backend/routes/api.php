<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\SchoolClassController;

Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::get('/students/statistics', [StudentController::class, 'statistics']);
        Route::get('/students/risk-level', [StudentController::class, 'getByRiskLevel']);
        Route::apiResource('students', StudentController::class);

        Route::apiResource('classes', SchoolClassController::class);

        Route::prefix('students/{student}')->group(function () {
            Route::apiResource('grades', GradeController::class);
            Route::apiResource('violations', ViolationController::class);
        });
    });
});
