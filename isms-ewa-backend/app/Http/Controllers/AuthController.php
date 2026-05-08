<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login endpoint
     * POST /api/auth/login
     */
    public function login(LoginRequest $request)
    {
        \Log::info('[AUTH] Login attempt', [
            'email' => $request->email,
            'ip' => $request->ip(),
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            \Log::warning('[AUTH] User not found', ['email' => $request->email]);
            return response()->json([
                'message' => 'Kredensial tidak valid.',
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            \Log::warning('[AUTH] Password mismatch', ['email' => $request->email]);
            return response()->json([
                'message' => 'Kredensial tidak valid.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        \Log::info('[AUTH] Login successful', [
            'email' => $request->email,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    /**
     * Logout endpoint
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout.',
        ], 200);
    }

    /**
     * Get current authenticated user
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        return response()->json($request->user(), 200);
    }
}
