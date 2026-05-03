<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function render($request, Throwable $exception)
    {
        if ($request->is('api/*')) {
            if ($exception instanceof \Illuminate\Validation\ValidationException) {
                return new \Illuminate\Http\JsonResponse([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $exception->errors(),
                ], 422);
            }

            if ($exception instanceof StudentNotFoundException) {
                return new \Illuminate\Http\JsonResponse([
                    'success' => false,
                    'message' => $exception->getMessage(),
                ], 404);
            }

            if ($exception instanceof InvalidScoreException) {
                return new \Illuminate\Http\JsonResponse([
                    'success' => false,
                    'message' => $exception->getMessage(),
                ], 400);
            }

            if ($exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return new \Illuminate\Http\JsonResponse([
                    'success' => false,
                    'message' => 'Resource not found',
                ], 404);
            }

            return new \Illuminate\Http\JsonResponse([
                'success' => false,
                'message' => 'Internal server error',
                'debug' => config('app.debug') ? $exception->getMessage() : null,
                'trace' => config('app.debug') ? $exception->getTraceAsString() : null,
            ], 500);
        }

        return parent::render($request, $exception);
    }
}
