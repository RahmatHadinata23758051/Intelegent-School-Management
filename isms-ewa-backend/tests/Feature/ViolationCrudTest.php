<?php

namespace Tests\Feature;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViolationCrudTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $student;
    protected $anotherStudent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $schoolClass = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ]);

        $this->student = Student::create([
            'name' => 'Ahmad Rizki',
            'email' => 'ahmad@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $schoolClass->id,
        ]);

        $this->anotherStudent = Student::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'student_id' => 'STU002',
            'school_class_id' => $schoolClass->id,
        ]);
    }

    /**
     * Test authenticated user can create violation for student
     */
    public function test_authenticated_user_can_create_violation_for_student()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/students/{$this->student->id}/violations", [
                'description' => 'Terlambat masuk kelas',
                'severity' => 'minor',
                'reported_date' => '2024-01-15',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'description',
                    'severity',
                ],
            ]);

        $this->assertDatabaseHas('violations', [
            'student_id' => $this->student->id,
            'description' => 'Terlambat masuk kelas',
            'severity' => 'minor',
        ]);
    }

    /**
     * Test cannot access violation from wrong student nested route
     */
    public function test_cannot_access_violation_from_wrong_student_nested_route()
    {
        $violation = Violation::create([
            'student_id' => $this->student->id,
            'description' => 'Terlambat masuk kelas',
            'severity' => 'minor',
            'reported_date' => '2024-01-15',
        ]);

        // Try to access violation from different student - should return 404
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/students/{$this->anotherStudent->id}/violations/{$violation->id}");

        // Should get 404 because violation doesn't belong to anotherStudent
        $response->assertStatus(404);
    }

    /**
     * Test validation rejects invalid severity
     */
    public function test_validation_rejects_invalid_severity()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/students/{$this->student->id}/violations", [
                'description' => 'Terlambat masuk kelas',
                'severity' => 'invalid_severity',
                'reported_date' => '2024-01-15',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['severity']);
    }

    /**
     * Test unauthenticated user cannot access violations
     */
    public function test_unauthenticated_user_cannot_access_violations()
    {
        $response = $this->getJson("/api/students/{$this->student->id}/violations");

        $response->assertStatus(401);
    }
}
