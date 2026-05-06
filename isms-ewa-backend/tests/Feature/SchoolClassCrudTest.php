<?php

namespace Tests\Feature;

use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchoolClassCrudTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    /**
     * Test authenticated user can list school classes
     */
    public function test_authenticated_user_can_list_school_classes()
    {
        SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/school-classes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'grade_level',
                        'created_at',
                        'updated_at',
                    ],
                ],
            ]);
    }

    /**
     * Test authenticated user can create school class
     */
    public function test_authenticated_user_can_create_school_class()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/school-classes', [
                'name' => 'X IPA 1',
                'grade_level' => 'X',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'grade_level',
                ],
            ]);

        $this->assertDatabaseHas('school_classes', [
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ]);
    }

    /**
     * Test validation error on invalid school class payload
     */
    public function test_validation_error_on_invalid_school_class_payload()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/school-classes', [
                'name' => '',
                'grade_level' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'grade_level']);
    }

    /**
     * Test unauthenticated user cannot access school classes
     */
    public function test_unauthenticated_user_cannot_access_school_classes()
    {
        $response = $this->getJson('/api/school-classes');

        $response->assertStatus(401);
    }
}
