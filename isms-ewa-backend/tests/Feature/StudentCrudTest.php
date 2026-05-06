<?php

namespace Tests\Feature;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentCrudTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $schoolClass;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $this->schoolClass = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ]);
    }

    /**
     * Test authenticated user can list students
     */
    public function test_authenticated_user_can_list_students()
    {
        Student::create([
            'name' => 'Ahmad Rizki',
            'email' => 'ahmad@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/students');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'student_id',
                        'name',
                        'email',
                    ],
                ],
            ]);
    }

    /**
     * Test authenticated user can create student
     */
    public function test_authenticated_user_can_create_student()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/students', [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad@example.com',
                'student_id' => 'STU001',
                'school_class_id' => $this->schoolClass->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'student_id',
                    'name',
                    'email',
                ],
            ]);

        $this->assertDatabaseHas('students', [
            'student_id' => 'STU001',
            'name' => 'Ahmad Rizki',
        ]);
    }

    /**
     * Test validation error on invalid student payload
     */
    public function test_validation_error_on_invalid_student_payload()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/students', [
                'name' => '',
                'student_id' => '',
                'school_class_id' => 999,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'student_id', 'school_class_id']);
    }

    /**
     * Test search/filter works
     */
    public function test_search_filter_works()
    {
        Student::create([
            'name' => 'Ahmad Rizki',
            'email' => 'ahmad@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Student::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'student_id' => 'STU002',
            'school_class_id' => $this->schoolClass->id,
        ]);

        // Search by name
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/students?search=Ahmad');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));

        // Filter by school_class_id
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/students?school_class_id=' . $this->schoolClass->id);

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    /**
     * Test unauthenticated user cannot access students
     */
    public function test_unauthenticated_user_cannot_access_students()
    {
        $response = $this->getJson('/api/students');

        $response->assertStatus(401);
    }
}
