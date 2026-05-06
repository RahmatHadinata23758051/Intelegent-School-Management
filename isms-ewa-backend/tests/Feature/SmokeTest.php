<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SmokeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test verifikasi Laravel versi 10 digunakan
     */
    public function test_laravel_version_10()
    {
        $this->assertTrue(str_starts_with(\Illuminate\Foundation\Application::VERSION, '10'));
    }

    /**
     * Test verifikasi konfigurasi DB_CONNECTION adalah sqlite
     */
    public function test_database_connection_is_sqlite()
    {
        $this->assertEquals('sqlite', config('database.default'));
    }

    /**
     * Test verifikasi semua 6 tabel ada di database
     */
    public function test_all_tables_exist()
    {
        $tables = [
            'users',
            'school_classes',
            'students',
            'grades',
            'violations',
            'risk_scores',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(
                DB::connection()->getSchemaBuilder()->hasTable($table),
                "Table {$table} does not exist"
            );
        }
    }

    /**
     * Test verifikasi semua route autentikasi terdaftar
     */
    public function test_auth_routes_registered()
    {
        // Test dengan actual HTTP requests
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        // Route exists jika tidak 404
        $this->assertNotEquals(404, $loginResponse->status());
    }

    /**
     * Test verifikasi semua file model ada di app/Models
     */
    public function test_all_models_exist()
    {
        $models = [
            'User',
            'SchoolClass',
            'Student',
            'Grade',
            'Violation',
            'RiskScore',
        ];

        foreach ($models as $model) {
            $modelClass = "App\\Models\\{$model}";
            $this->assertTrue(
                class_exists($modelClass),
                "Model {$modelClass} does not exist"
            );
        }
    }

    /**
     * Test verifikasi direktori app/Services ada
     */
    public function test_services_directory_exists()
    {
        $this->assertTrue(
            is_dir(app_path('Services')),
            'Services directory does not exist'
        );
    }

    /**
     * Test verifikasi direktori app/Http/Requests ada
     */
    public function test_requests_directory_exists()
    {
        $this->assertTrue(
            is_dir(app_path('Http/Requests')),
            'Requests directory does not exist'
        );
    }

    /**
     * Test verifikasi LoginRequest ada
     */
    public function test_login_request_exists()
    {
        $this->assertTrue(
            class_exists('App\\Http\\Requests\\LoginRequest'),
            'LoginRequest class does not exist'
        );
    }

    /**
     * Test verifikasi AuthController ada
     */
    public function test_auth_controller_exists()
    {
        $this->assertTrue(
            class_exists('App\\Http\\Controllers\\AuthController'),
            'AuthController class does not exist'
        );
    }

    /**
     * Test verifikasi UserSeeder membuat user admin
     */
    public function test_user_seeder_creates_admin_user()
    {
        // Run seeder
        $this->seed(\Database\Seeders\UserSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@isms.test',
            'role' => 'admin',
        ]);
    }

    /**
     * Test verifikasi admin user password ter-hash
     */
    public function test_admin_user_password_is_hashed()
    {
        // Run seeder
        $this->seed(\Database\Seeders\UserSeeder::class);

        $user = \App\Models\User::where('email', 'admin@isms.test')->first();

        $this->assertNotNull($user);
        $this->assertNotEquals('password', $user->password);
        $this->assertTrue(
            \Illuminate\Support\Facades\Hash::check('password', $user->password)
        );
    }
}
