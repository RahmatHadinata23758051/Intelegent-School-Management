<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user('sanctum')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        return $next($request);
    }
}
