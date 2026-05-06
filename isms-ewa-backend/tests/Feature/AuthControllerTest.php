<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login dengan kredensial valid
     */
    public function test_login_with_valid_credentials()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
            ]);
    }

    /**
     * Test login dengan password salah
     */
    public function test_login_with_wrong_password()
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Kredensial tidak valid.',
            ]);
    }

    /**
     * Test login dengan email tidak terdaftar
     */
    public function test_login_with_unregistered_email()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'notfound@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Kredensial tidak valid.',
            ]);
    }

    /**
     * Test logout dengan token valid
     */
    public function test_logout_with_valid_token()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Berhasil logout.',
            ]);
    }

    /**
     * Test /me endpoint dengan token valid
     */
    public function test_me_endpoint_with_valid_token()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'name' => 'Test User',
                'email' => 'test@example.com',
                'role' => 'admin',
            ])
            ->assertJsonMissing([
                'password',
            ]);
    }

    /**
     * Test /me endpoint tanpa token
     */
    public function test_me_endpoint_without_token()
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }
}
