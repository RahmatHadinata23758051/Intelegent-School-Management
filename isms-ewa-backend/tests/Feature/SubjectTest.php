<?php

namespace Tests\Feature;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubjectTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;
    protected $homeroom;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->homeroom = User::factory()->create(['role' => 'homeroom_teacher']);
    }

    // ===== CREATE TESTS =====

    public function test_admin_can_create_subject()
    {
        $data = [
            'code' => 'MTK',
            'name' => 'Matematika',
            'description' => 'Mata pelajaran matematika',
            'credit_hours' => 4,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/subjects', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Subject created successfully',
            ]);

        $this->assertDatabaseHas('subjects', ['code' => 'MTK']);
    }

    public function test_teacher_cannot_create_subject()
    {
        $data = [
            'code' => 'MTK',
            'name' => 'Matematika',
            'credit_hours' => 4,
        ];

        $response = $this->actingAs($this->teacher)->postJson('/api/subjects', $data);

        $response->assertStatus(403);
    }

    public function test_homeroom_cannot_create_subject()
    {
        $data = [
            'code' => 'MTK',
            'name' => 'Matematika',
            'credit_hours' => 4,
        ];

        $response = $this->actingAs($this->homeroom)->postJson('/api/subjects', $data);

        $response->assertStatus(403);
    }

    public function test_create_subject_requires_code()
    {
        $data = [
            'name' => 'Matematika',
            'credit_hours' => 4,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('code');
    }

    public function test_create_subject_requires_name()
    {
        $data = [
            'code' => 'MTK',
            'credit_hours' => 4,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_create_subject_code_must_be_unique()
    {
        Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $data = [
            'code' => 'MTK',
            'name' => 'Matematika Lanjut',
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('code');
    }

    public function test_create_subject_credit_hours_must_be_positive()
    {
        $data = [
            'code' => 'MTK',
            'name' => 'Matematika',
            'credit_hours' => 0,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('credit_hours');
    }

    // ===== READ TESTS =====

    public function test_admin_can_list_subjects()
    {
        Subject::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/subjects');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subjects retrieved successfully',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_teacher_can_list_subjects()
    {
        Subject::factory()->count(3)->create();

        $response = $this->actingAs($this->teacher)->getJson('/api/subjects');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_homeroom_can_list_subjects()
    {
        Subject::factory()->count(3)->create();

        $response = $this->actingAs($this->homeroom)->getJson('/api/subjects');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_admin_can_view_subject_detail()
    {
        $subject = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $response = $this->actingAs($this->admin)->getJson("/api/subjects/{$subject->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $subject->id,
                    'code' => 'MTK',
                    'name' => 'Matematika',
                ],
            ]);
    }

    public function test_teacher_can_view_subject_detail()
    {
        $subject = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $response = $this->actingAs($this->teacher)->getJson("/api/subjects/{$subject->id}");

        $response->assertStatus(200);
    }

    // ===== UPDATE TESTS =====

    public function test_admin_can_update_subject()
    {
        $subject = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $data = [
            'code' => 'MTK',
            'name' => 'Matematika Dasar',
            'credit_hours' => 3,
        ];

        $response = $this->actingAs($this->admin)->putJson("/api/subjects/{$subject->id}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subject updated successfully',
            ]);

        $this->assertDatabaseHas('subjects', [
            'id' => $subject->id,
            'name' => 'Matematika Dasar',
        ]);
    }

    public function test_teacher_cannot_update_subject()
    {
        $subject = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $data = [
            'code' => 'MTK',
            'name' => 'Matematika Dasar',
        ];

        $response = $this->actingAs($this->teacher)->putJson("/api/subjects/{$subject->id}", $data);

        $response->assertStatus(403);
    }

    public function test_update_subject_code_must_be_unique()
    {
        $subject1 = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $subject2 = Subject::create([
            'code' => 'BIN',
            'name' => 'Bahasa Indonesia',
        ]);

        $data = [
            'code' => 'MTK',
            'name' => 'Bahasa Indonesia Baru',
        ];

        $response = $this->actingAs($this->admin)->putJson("/api/subjects/{$subject2->id}", $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('code');
    }

    // ===== DELETE TESTS =====

    public function test_admin_can_delete_subject()
    {
        $subject = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/subjects/{$subject->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subject deleted successfully',
            ]);

        $this->assertSoftDeleted('subjects', ['id' => $subject->id]);
    }

    public function test_teacher_cannot_delete_subject()
    {
        $subject = Subject::create([
            'code' => 'MTK',
            'name' => 'Matematika',
        ]);

        $response = $this->actingAs($this->teacher)->deleteJson("/api/subjects/{$subject->id}");

        $response->assertStatus(403);
    }

    // ===== DROPDOWN TESTS =====

    public function test_admin_can_get_subject_dropdown()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects/dropdown');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subject dropdown retrieved successfully',
            ])
            ->assertJsonCount(1, 'data');
    }

    public function test_teacher_can_get_subject_dropdown()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);

        $response = $this->actingAs($this->teacher)->getJson('/api/subjects/dropdown');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_dropdown_returns_only_active_subjects()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => true]);
        Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects/dropdown');

        $response->assertJsonCount(2, 'data');
    }

    // ===== SEARCH & FILTER TESTS =====

    public function test_search_subjects_by_code()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika']);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?search=MTK');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_subjects_by_name()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika']);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?search=Matematika');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_subjects_by_status()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?status=active');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_sort_subjects_by_code()
    {
        Subject::create(['code' => 'ZZZ', 'name' => 'Subject Z']);
        Subject::create(['code' => 'AAA', 'name' => 'Subject A']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?sort=code&sort_direction=asc');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals('AAA', $data[0]['code']);
    }

    // ===== PAGINATION TESTS =====

    public function test_subjects_pagination()
    {
        Subject::factory()->count(20)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?per_page=10');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJson([
                'pagination' => [
                    'total' => 20,
                    'per_page' => 10,
                    'current_page' => 1,
                    'last_page' => 2,
                ],
            ]);
    }
}
