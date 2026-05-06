<?php

namespace App\Http\Middleware;

use App\Constants\UserRole;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Jika user tidak authenticated, biarkan auth middleware handle
        if (!$request->user()) {
            return $this->errorResponse(
                'Unauthenticated.',
                null,
                401
            );
        }

        // Validasi role parameter
        $validRoles = array_filter($roles, fn($role) => UserRole::isValid($role));
        
        if (empty($validRoles)) {
            return $this->errorResponse(
                'Invalid role configuration.',
                null,
                500
            );
        }

        // Cek apakah user punya salah satu dari role yang diizinkan
        if (!in_array($request->user()->role, $validRoles)) {
            return $this->errorResponse(
                'Anda tidak memiliki akses untuk aksi ini.',
                null,
                403
            );
        }

        return $next($request);
    }
}
