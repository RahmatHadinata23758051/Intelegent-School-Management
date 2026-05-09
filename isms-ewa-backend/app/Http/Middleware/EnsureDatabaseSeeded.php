<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

class EnsureDatabaseSeeded
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Only check on development environment
        if (app()->environment('local')) {
            try {
                // Check if users table is empty
                if (!User::exists()) {
                    // Run seeder
                    Artisan::call('migrate:fresh', ['--seed' => true, '--quiet' => true]);
                }
            } catch (\Exception $e) {
                // Log error but don't block the request
                \Log::warning('Failed to ensure database is seeded: ' . $e->getMessage());
            }
        }

        return $next($request);
    }
}
