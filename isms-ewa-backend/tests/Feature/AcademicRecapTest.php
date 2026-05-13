<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\StudentAcademicSummary;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicRecapTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /** @test */
    public function admin_can_generate_student_academic_summary()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/academic-summaries/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'student_id',
                    'average_score',
                    'attendance_rate',
                    'violation_count',
                    'academic_status',
                    'attendance_status',
                    'behavior_status',
                    'overall_status',
                ],
            ]);

        $this->assertDatabaseHas('student_academic_summaries', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);
    }

    /** @test */
    public function admin_can_generate_class_academic_summaries()
    {
        $admin = User::where('role', 'admin')->first();
        $schoolClass = SchoolClass::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/academic-summaries/generate', [
            'school_class_id' => $schoolClass->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'data',
                    'count',
                ],
            ]);
    }

    /** @test */
    public function admin_can_list_academic_summaries()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/academic-summaries');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['data', 'meta'],
            ]);
    }

    /** @test */
    public function admin_can_view_academic_summary_detail()
    {
        $admin = User::where('role', 'admin')->first();
        $summary = StudentAcademicSummary::first();

        if (!$summary) {
            $this->markTestSkipped('No academic summary found');
        }

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/academic-summaries/{$summary->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'student_id',
                    'average_score',
                    'overall_status',
                ],
            ]);
    }

    /** @test */
    public function admin_can_get_student_summary()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        // Generate summary first
        $this->actingAs($admin, 'sanctum')->postJson('/api/academic-summaries/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/academic-summary?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_get_class_summaries()
    {
        $admin = User::where('role', 'admin')->first();
        $schoolClass = SchoolClass::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/classes/{$schoolClass->id}/academic-summaries?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data',
                    'count',
                ],
            ]);
    }

    /** @test */
    public function admin_can_get_subject_grade_breakdown()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/subject-grade-breakdown?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_subjects',
                    'average_score',
                    'subjects',
                ],
            ]);
    }

    /** @test */
    public function admin_can_get_attendance_recap()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/attendance-recap?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_sessions',
                    'present_count',
                    'attendance_rate',
                ],
            ]);
    }

    /** @test */
    public function admin_can_get_violation_recap()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/violation-recap?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_count',
                    'minor_count',
                    'moderate_count',
                    'major_count',
                    'severe_count',
                ],
            ]);
    }

    /** @test */
    public function homeroom_teacher_can_generate_summary_for_own_class()
    {
        $homeroomTeacher = User::where('role', 'homeroom_teacher')->first();
        $schoolClass = $homeroomTeacher->teacherProfile->homeroomClass;
        
        if (!$schoolClass) {
            $this->markTestSkipped('Homeroom teacher has no class');
        }

        $student = $schoolClass->students()->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($homeroomTeacher, 'sanctum')->postJson('/api/academic-summaries/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function teacher_cannot_generate_academic_summary()
    {
        $teacher = User::where('role', 'teacher')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($teacher, 'sanctum')->postJson('/api/academic-summaries/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function filter_by_academic_status_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/academic-summaries?academic_status=excellent');

        $response->assertStatus(200);
    }

    /** @test */
    public function filter_by_overall_status_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/academic-summaries?overall_status=critical');

        $response->assertStatus(200);
    }

    /** @test */
    public function filter_with_low_scores_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/academic-summaries?with_low_scores=true');

        $response->assertStatus(200);
    }

    /** @test */
    public function filter_with_poor_attendance_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/academic-summaries?with_poor_attendance=true');

        $response->assertStatus(200);
    }
}
