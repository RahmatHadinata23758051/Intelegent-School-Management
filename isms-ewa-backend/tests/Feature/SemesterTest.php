<?php

namespace Tests\Feature;

use App\Constants\UserRole;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SemesterTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $teacher;
    protected AcademicYear $academicYear;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $this->teacher = User::factory()->create(['role' => UserRole::TEACHER]);
        $this->academicYear = AcademicYear::factory()->create();
    }

    /**
     * Test admin can create semester
     */
    public function test_admin_can_create_semester()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/semesters', [
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
            'start_date' => '2024-07-01',
            'end_date' => '2024-11-30',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.semester_number', 1);
        $response->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('semesters', [
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
        ]);
    }

    /**
     * Test teacher cannot create semester
     */
    public function test_teacher_cannot_create_semester()
    {
        $response = $this->actingAs($this->teacher)->postJson('/api/semesters', [
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
            'start_date' => '2024-07-01',
            'end_date' => '2024-11-30',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test admin can list semesters
     */
    public function test_admin_can_list_semesters()
    {
        Semester::factory()->semesterOne()->create(['academic_year_id' => $this->academicYear->id]);
        Semester::factory()->semesterTwo()->create(['academic_year_id' => $this->academicYear->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/semesters');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    /**
     * Test teacher can list semesters
     */
    public function test_teacher_can_list_semesters()
    {
        Semester::factory()->semesterOne()->create(['academic_year_id' => $this->academicYear->id]);
        Semester::factory()->semesterTwo()->create(['academic_year_id' => $this->academicYear->id]);

        $response = $this->actingAs($this->teacher)->getJson('/api/semesters');

        $response->assertStatus(200);
    }

    /**
     * Test admin can view semester detail
     */
    public function test_admin_can_view_semester_detail()
    {
        $semester = Semester::factory()->create(['academic_year_id' => $this->academicYear->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/semesters/{$semester->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.semester_number', $semester->semester_number);
    }

    /**
     * Test admin can update semester
     */
    public function test_admin_can_update_semester()
    {
        $semester = Semester::factory()->create(['academic_year_id' => $this->academicYear->id]);

        $response = $this->actingAs($this->admin)->putJson("/api/semesters/{$semester->id}", [
            'start_date' => '2024-08-01',
            'end_date' => '2024-12-31',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('semesters', [
            'id' => $semester->id,
            'start_date' => '2024-08-01',
        ]);
    }

    /**
     * Test admin cannot delete active semester
     */
    public function test_admin_cannot_delete_active_semester()
    {
        $semester = Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/semesters/{$semester->id}");

        $response->assertStatus(422);
        $this->assertDatabaseHas('semesters', ['id' => $semester->id]);
    }

    /**
     * Test admin can delete inactive semester
     */
    public function test_admin_can_delete_inactive_semester()
    {
        $semester = Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/semesters/{$semester->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('semesters', ['id' => $semester->id]);
    }

    /**
     * Test admin can activate semester
     */
    public function test_admin_can_activate_semester()
    {
        $semester = Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/semesters/{$semester->id}/activate");

        $response->assertStatus(200);
        $response->assertJsonPath('data.is_active', true);
        $this->assertDatabaseHas('semesters', [
            'id' => $semester->id,
            'is_active' => true,
        ]);
    }

    /**
     * Test only one semester can be active per academic year
     */
    public function test_only_one_semester_can_be_active_per_academic_year()
    {
        $semester1 = Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
            'is_active' => true,
        ]);
        $semester2 = Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 2,
            'is_active' => false,
        ]);

        $this->actingAs($this->admin)->postJson("/api/semesters/{$semester2->id}/activate");

        $this->assertDatabaseHas('semesters', [
            'id' => $semester1->id,
            'is_active' => false,
        ]);
        $this->assertDatabaseHas('semesters', [
            'id' => $semester2->id,
            'is_active' => true,
        ]);
    }

    /**
     * Test activating semester auto-activates parent academic year
     */
    public function test_activating_semester_auto_activates_parent_academic_year()
    {
        $academicYear = AcademicYear::factory()->create(['is_active' => false]);
        $semester = Semester::factory()->create([
            'academic_year_id' => $academicYear->id,
            'is_active' => false,
        ]);

        $this->actingAs($this->admin)->postJson("/api/semesters/{$semester->id}/activate");

        $this->assertDatabaseHas('academic_years', [
            'id' => $academicYear->id,
            'is_active' => true,
        ]);
    }

    /**
     * Test get active semester
     */
    public function test_get_active_semester()
    {
        $activeSemester = Semester::factory()->semesterOne()->create([
            'academic_year_id' => $this->academicYear->id,
            'is_active' => true,
        ]);
        Semester::factory()->semesterTwo()->create([
            'academic_year_id' => $this->academicYear->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/semesters/active/current');

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $activeSemester->id);
    }

    /**
     * Test get active semester returns 404 when none active
     */
    public function test_get_active_semester_returns_404_when_none_active()
    {
        Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/semesters/active/current');

        $response->assertStatus(404);
    }

    /**
     * Test get semesters by academic year
     */
    public function test_get_semesters_by_academic_year()
    {
        Semester::factory()->semesterOne()->create(['academic_year_id' => $this->academicYear->id]);
        Semester::factory()->semesterTwo()->create(['academic_year_id' => $this->academicYear->id]);
        $otherYear = AcademicYear::factory()->create();
        Semester::factory()->create(['academic_year_id' => $otherYear->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/semesters/by-academic-year?academic_year_id={$this->academicYear->id}");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    /**
     * Test validation: semester_number must be 1 or 2
     */
    public function test_semester_number_must_be_1_or_2()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/semesters', [
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 3,
            'start_date' => '2024-07-01',
            'end_date' => '2024-11-30',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Nomor semester harus 1 atau 2.');
    }

    /**
     * Test validation: cannot have duplicate semester number in same academic year
     */
    public function test_cannot_have_duplicate_semester_number_in_same_academic_year()
    {
        Semester::factory()->create([
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
        ]);

        $response = $this->actingAs($this->admin)->postJson('/api/semesters', [
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
            'start_date' => '2024-07-01',
            'end_date' => '2024-11-30',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Semester sudah ada untuk tahun ajaran ini.');
    }

    /**
     * Test validation: end_date must be after start_date
     */
    public function test_end_date_must_be_after_start_date()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/semesters', [
            'academic_year_id' => $this->academicYear->id,
            'semester_number' => 1,
            'start_date' => '2024-11-30',
            'end_date' => '2024-07-01',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Tanggal berakhir harus setelah tanggal mulai.');
    }
}
