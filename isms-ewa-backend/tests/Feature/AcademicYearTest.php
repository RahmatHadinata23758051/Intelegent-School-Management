<?php

namespace Tests\Feature;

use App\Constants\UserRole;
use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicYearTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $teacher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $this->teacher = User::factory()->create(['role' => UserRole::TEACHER]);
    }

    /**
     * Test admin can create academic year
     */
    public function test_admin_can_create_academic_year()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/academic-years', [
            'year' => '2024/2025',
            'start_date' => '2024-07-01',
            'end_date' => '2025-06-30',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.year', '2024/2025');
        $response->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('academic_years', [
            'year' => '2024/2025',
        ]);
    }

    /**
     * Test teacher cannot create academic year
     */
    public function test_teacher_cannot_create_academic_year()
    {
        $response = $this->actingAs($this->teacher)->postJson('/api/academic-years', [
            'year' => '2024/2025',
            'start_date' => '2024-07-01',
            'end_date' => '2025-06-30',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test admin can list academic years
     */
    public function test_admin_can_list_academic_years()
    {
        $year1 = AcademicYear::factory()->create();
        $year2 = AcademicYear::factory()->create();
        $year3 = AcademicYear::factory()->create();

        $response = $this->actingAs($this->admin)->getJson('/api/academic-years');

        $response->assertStatus(200);
        // The response should be ordered by year in descending order (default)
        $response->assertJsonCount(3, 'data');
    }

    /**
     * Test teacher can list academic years
     */
    public function test_teacher_can_list_academic_years()
    {
        AcademicYear::factory()->count(3)->create();

        $response = $this->actingAs($this->teacher)->getJson('/api/academic-years');

        $response->assertStatus(200);
    }

    /**
     * Test admin can view academic year detail
     */
    public function test_admin_can_view_academic_year_detail()
    {
        $academicYear = AcademicYear::factory()->create();

        $response = $this->actingAs($this->admin)->getJson("/api/academic-years/{$academicYear->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.year', $academicYear->year);
    }

    /**
     * Test admin can update academic year
     */
    public function test_admin_can_update_academic_year()
    {
        $academicYear = AcademicYear::factory()->create();

        $response = $this->actingAs($this->admin)->putJson("/api/academic-years/{$academicYear->id}", [
            'start_date' => '2024-08-01',
            'end_date' => '2025-07-31',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('academic_years', [
            'id' => $academicYear->id,
            'start_date' => '2024-08-01',
        ]);
    }

    /**
     * Test admin cannot delete active academic year
     */
    public function test_admin_cannot_delete_active_academic_year()
    {
        $academicYear = AcademicYear::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/academic-years/{$academicYear->id}");

        $response->assertStatus(422);
        $this->assertDatabaseHas('academic_years', ['id' => $academicYear->id]);
    }

    /**
     * Test admin can delete inactive academic year
     */
    public function test_admin_can_delete_inactive_academic_year()
    {
        $academicYear = AcademicYear::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/academic-years/{$academicYear->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('academic_years', ['id' => $academicYear->id]);
    }

    /**
     * Test admin can activate academic year
     */
    public function test_admin_can_activate_academic_year()
    {
        $academicYear = AcademicYear::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->postJson("/api/academic-years/{$academicYear->id}/activate");

        $response->assertStatus(200);
        $response->assertJsonPath('data.is_active', true);
        $this->assertDatabaseHas('academic_years', [
            'id' => $academicYear->id,
            'is_active' => true,
        ]);
    }

    /**
     * Test only one academic year can be active at a time
     */
    public function test_only_one_academic_year_can_be_active()
    {
        $year1 = AcademicYear::factory()->create(['is_active' => true]);
        $year2 = AcademicYear::factory()->create(['is_active' => false]);

        $this->actingAs($this->admin)->postJson("/api/academic-years/{$year2->id}/activate");

        $this->assertDatabaseHas('academic_years', [
            'id' => $year1->id,
            'is_active' => false,
        ]);
        $this->assertDatabaseHas('academic_years', [
            'id' => $year2->id,
            'is_active' => true,
        ]);
    }

    /**
     * Test get active academic year
     */
    public function test_get_active_academic_year()
    {
        $activeYear = AcademicYear::factory()->create(['is_active' => true]);
        AcademicYear::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/academic-years/active/current');

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $activeYear->id);
    }

    /**
     * Test get active academic year returns 404 when none active
     */
    public function test_get_active_academic_year_returns_404_when_none_active()
    {
        AcademicYear::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/academic-years/active/current');

        $response->assertStatus(404);
    }

    /**
     * Test validation: year must be unique
     */
    public function test_year_must_be_unique()
    {
        AcademicYear::factory()->create(['year' => '2024/2025']);

        $response = $this->actingAs($this->admin)->postJson('/api/academic-years', [
            'year' => '2024/2025',
            'start_date' => '2024-07-01',
            'end_date' => '2025-06-30',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Tahun ajaran sudah terdaftar.');
    }

    /**
     * Test validation: end_date must be after start_date
     */
    public function test_end_date_must_be_after_start_date()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/academic-years', [
            'year' => '2024/2025',
            'start_date' => '2025-06-30',
            'end_date' => '2024-07-01',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Tanggal berakhir harus setelah tanggal mulai.');
    }
}
