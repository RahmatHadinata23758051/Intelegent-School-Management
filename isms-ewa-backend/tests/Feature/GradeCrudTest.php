<?php

namespace Tests\Feature;

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GradeCrudTest extends TestCase
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
     * Test authenticated user can create grade for student
     */
    public function test_authenticated_user_can_create_grade_for_student()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/students/{$this->student->id}/grades", [
                'subject' => 'Matematika',
                'score' => 85.5,
                'semester' => '1',
                'academic_year' => '2024/2025',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'subject',
                    'score',
                ],
            ]);

        $this->assertDatabaseHas('grades', [
            'student_id' => $this->student->id,
            'subject' => 'Matematika',
            'score' => 85.5,
        ]);
    }

    /**
     * Test cannot access grade from wrong student nested route
     */
    public function test_cannot_access_grade_from_wrong_student_nested_route()
    {
        $grade = Grade::create([
            'student_id' => $this->student->id,
            'subject' => 'Matematika',
            'score' => 85.5,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        // Try to access grade from different student - should return 404
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/students/{$this->anotherStudent->id}/grades/{$grade->id}");

        // Should get 404 because grade doesn't belong to anotherStudent
        $response->assertStatus(404);
    }

    /**
     * Test validation rejects invalid score
     */
    public function test_validation_rejects_invalid_score()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/students/{$this->student->id}/grades", [
                'subject' => 'Matematika',
                'score' => 150,
                'semester' => '1',
                'academic_year' => '2024/2025',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['score']);
    }

    /**
     * Test unauthenticated user cannot access grades
     */
    public function test_unauthenticated_user_cannot_access_grades()
    {
        $response = $this->getJson("/api/students/{$this->student->id}/grades");

        $response->assertStatus(401);
    }
}
