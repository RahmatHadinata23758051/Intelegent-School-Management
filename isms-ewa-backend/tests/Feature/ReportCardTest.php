<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\ReportCard;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportCardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /** @test */
    public function admin_can_generate_student_report_card()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/report-cards/generate', [
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
                    'report_number',
                    'status',
                    'subject_grades',
                    'attendance_summary',
                    'violation_summary',
                    'academic_summary',
                ],
            ]);

        $this->assertDatabaseHas('report_cards', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'status' => 'generated',
        ]);
    }

    /** @test */
    public function admin_can_generate_class_report_cards()
    {
        $admin = User::where('role', 'admin')->first();
        $schoolClass = SchoolClass::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/report-cards/generate', [
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
    public function admin_can_list_report_cards()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/report-cards');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['data', 'meta'],
            ]);
    }

    /** @test */
    public function admin_can_view_report_card_detail()
    {
        $admin = User::where('role', 'admin')->first();
        $reportCard = ReportCard::first();

        if (!$reportCard) {
            $this->markTestSkipped('No report card found');
        }

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/report-cards/{$reportCard->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'report_number',
                    'status',
                    'subject_grades',
                ],
            ]);
    }

    /** @test */
    public function admin_can_update_report_card_notes()
    {
        $admin = User::where('role', 'admin')->first();
        $reportCard = ReportCard::where('status', 'generated')->first();

        if (!$reportCard) {
            $this->markTestSkipped('No generated report card found');
        }

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/report-cards/{$reportCard->id}", [
            'notes' => 'Siswa menunjukkan perkembangan yang baik',
            'homeroom_notes' => 'Perlu ditingkatkan kedisiplinan',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('report_cards', [
            'id' => $reportCard->id,
            'notes' => 'Siswa menunjukkan perkembangan yang baik',
        ]);
    }

    /** @test */
    public function admin_can_approve_report_card()
    {
        $admin = User::where('role', 'admin')->first();
        $reportCard = ReportCard::where('status', 'generated')->first();

        if (!$reportCard) {
            $this->markTestSkipped('No generated report card found');
        }

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/report-cards/{$reportCard->id}/approve");

        $response->assertStatus(200);
        $this->assertDatabaseHas('report_cards', [
            'id' => $reportCard->id,
            'status' => 'approved',
            'approved_by' => $admin->id,
        ]);
    }

    /** @test */
    public function cannot_update_approved_report_card()
    {
        $admin = User::where('role', 'admin')->first();
        $reportCard = ReportCard::where('status', 'approved')->first();

        if (!$reportCard) {
            // Create and approve one
            $student = Student::first();
            $academicYear = AcademicYear::where('is_active', true)->first();
            $semester = Semester::where('is_active', true)->first();

            $response = $this->actingAs($admin, 'sanctum')->postJson('/api/report-cards/generate', [
                'student_id' => $student->id,
                'academic_year_id' => $academicYear->id,
                'semester_id' => $semester->id,
            ]);

            $reportCard = ReportCard::find($response->json('data.id'));
            $this->actingAs($admin, 'sanctum')->postJson("/api/report-cards/{$reportCard->id}/approve");
            $reportCard->refresh();
        }

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/report-cards/{$reportCard->id}", [
            'notes' => 'Trying to update approved report card',
        ]);

        $response->assertStatus(400);
    }

    /** @test */
    public function admin_can_get_student_report_card()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        // Generate report card first
        $this->actingAs($admin, 'sanctum')->postJson('/api/report-cards/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/report-card?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_get_class_report_cards()
    {
        $admin = User::where('role', 'admin')->first();
        $schoolClass = SchoolClass::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/classes/{$schoolClass->id}/report-cards?academic_year_id={$academicYear->id}&semester_id={$semester->id}");

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
    public function homeroom_teacher_can_generate_report_card_for_own_class()
    {
        $homeroomTeacher = User::where('role', 'homeroom_teacher')->first();
        $schoolClass = $homeroomTeacher->teacherProfile->homeroomClass;
        
        if (!$schoolClass) {
            $this->markTestSkipped('Homeroom teacher has no class');
        }

        $student = $schoolClass->students()->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($homeroomTeacher, 'sanctum')->postJson('/api/report-cards/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function homeroom_teacher_can_approve_report_card_for_own_class()
    {
        $homeroomTeacher = User::where('role', 'homeroom_teacher')->first();
        $schoolClass = $homeroomTeacher->teacherProfile->homeroomClass;
        
        if (!$schoolClass) {
            $this->markTestSkipped('Homeroom teacher has no class');
        }

        $student = $schoolClass->students()->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        // Generate report card
        $response = $this->actingAs($homeroomTeacher, 'sanctum')->postJson('/api/report-cards/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $reportCard = ReportCard::find($response->json('data.id'));

        // Approve it
        $response = $this->actingAs($homeroomTeacher, 'sanctum')->postJson("/api/report-cards/{$reportCard->id}/approve");

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_cannot_generate_report_card()
    {
        $teacher = User::where('role', 'teacher')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($teacher, 'sanctum')->postJson('/api/report-cards/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function filter_by_status_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/report-cards?status=generated');

        $response->assertStatus(200);
    }

    /** @test */
    public function report_number_format_is_correct()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/report-cards/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $reportNumber = $response->json('data.report_number');
        
        // Format: RC/{year}/{semester}/{class}/{student_id}
        $this->assertMatchesRegularExpression('/^RC\/\d{4}\/\d+\/[A-Z0-9]+\/\d{4}$/', $reportNumber);
    }

    /** @test */
    public function report_card_contains_all_required_snapshots()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/report-cards/generate', [
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
        ]);

        $response->assertStatus(201);
        
        $data = $response->json('data');
        $this->assertArrayHasKey('subject_grades', $data);
        $this->assertArrayHasKey('attendance_summary', $data);
        $this->assertArrayHasKey('violation_summary', $data);
        $this->assertArrayHasKey('academic_summary', $data);
    }
}
