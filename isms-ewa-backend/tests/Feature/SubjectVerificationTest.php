<?php

namespace Tests\Feature;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubjectVerificationTest extends TestCase
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

    // ===== VERIFICATION: SEARCH BY CODE =====
    public function test_search_by_code_works_correctly()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika']);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia']);
        Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?search=MTK');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'MTK');
    }

    // ===== VERIFICATION: SEARCH BY NAME =====
    public function test_search_by_name_works_correctly()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika']);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia']);
        Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?search=Matematika');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Matematika');
    }

    // ===== VERIFICATION: FILTER STATUS ACTIVE =====
    public function test_filter_status_active_works_correctly()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => true]);
        Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?status=active');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        $data = $response->json('data');
        foreach ($data as $subject) {
            $this->assertTrue($subject['is_active']);
        }
    }

    // ===== VERIFICATION: FILTER STATUS INACTIVE =====
    public function test_filter_status_inactive_works_correctly()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => false]);
        Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?status=inactive');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        $data = $response->json('data');
        foreach ($data as $subject) {
            $this->assertFalse($subject['is_active']);
        }
    }

    // ===== VERIFICATION: SORT BY CODE =====
    public function test_sort_by_code_works_correctly()
    {
        Subject::create(['code' => 'ZZZ', 'name' => 'Subject Z']);
        Subject::create(['code' => 'AAA', 'name' => 'Subject A']);
        Subject::create(['code' => 'MMM', 'name' => 'Subject M']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?sort=code&sort_direction=asc');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');

        $data = $response->json('data');
        $this->assertEquals('AAA', $data[0]['code']);
        $this->assertEquals('MMM', $data[1]['code']);
        $this->assertEquals('ZZZ', $data[2]['code']);
    }

    // ===== VERIFICATION: SORT BY NAME =====
    public function test_sort_by_name_works_correctly()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Zebra']);
        Subject::create(['code' => 'BIN', 'name' => 'Apple']);
        Subject::create(['code' => 'BIG', 'name' => 'Mango']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?sort=name&sort_direction=asc');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');

        $data = $response->json('data');
        $this->assertEquals('Apple', $data[0]['name']);
        $this->assertEquals('Mango', $data[1]['name']);
        $this->assertEquals('Zebra', $data[2]['name']);
    }

    // ===== VERIFICATION: SORT BY CREATED_AT =====
    public function test_sort_by_created_at_works_correctly()
    {
        $subject1 = Subject::create(['code' => 'MTK', 'name' => 'Matematika']);
        sleep(1);
        $subject2 = Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia']);
        sleep(1);
        $subject3 = Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris']);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?sort=created_at&sort_direction=desc');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');

        $data = $response->json('data');
        $this->assertEquals($subject3->id, $data[0]['id']);
        $this->assertEquals($subject2->id, $data[1]['id']);
        $this->assertEquals($subject1->id, $data[2]['id']);
    }

    // ===== VERIFICATION: PAGINATION =====
    public function test_pagination_works_correctly()
    {
        Subject::factory()->count(25)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/subjects?per_page=10');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('pagination.total', 25)
            ->assertJsonPath('pagination.per_page', 10)
            ->assertJsonPath('pagination.current_page', 1)
            ->assertJsonPath('pagination.last_page', 3);
    }

    // ===== VERIFICATION: DROPDOWN RETURNS ONLY ACTIVE =====
    public function test_dropdown_returns_only_active_subjects()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => true]);
        Subject::create(['code' => 'BIG', 'name' => 'Bahasa Inggris', 'is_active' => false]);
        Subject::create(['code' => 'IPA', 'name' => 'IPA', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/subjects/dropdown');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        $data = $response->json('data');
        foreach ($data as $subject) {
            $this->assertTrue($subject['is_active']);
        }
    }

    // ===== VERIFICATION: TEACHER READ-ONLY =====
    public function test_teacher_can_read_but_not_write()
    {
        $subject = Subject::create(['code' => 'MTK', 'name' => 'Matematika']);

        // Teacher can read
        $readResponse = $this->actingAs($this->teacher)->getJson('/api/subjects');
        $readResponse->assertStatus(200);

        // Teacher cannot create
        $createResponse = $this->actingAs($this->teacher)->postJson('/api/subjects', [
            'code' => 'BIN',
            'name' => 'Bahasa Indonesia',
        ]);
        $createResponse->assertStatus(403);

        // Teacher cannot update
        $updateResponse = $this->actingAs($this->teacher)->putJson("/api/subjects/{$subject->id}", [
            'code' => 'MTK',
            'name' => 'Matematika Dasar',
        ]);
        $updateResponse->assertStatus(403);

        // Teacher cannot delete
        $deleteResponse = $this->actingAs($this->teacher)->deleteJson("/api/subjects/{$subject->id}");
        $deleteResponse->assertStatus(403);
    }

    // ===== VERIFICATION: HOMEROOM READ-ONLY =====
    public function test_homeroom_can_read_but_not_write()
    {
        $subject = Subject::create(['code' => 'MTK', 'name' => 'Matematika']);

        // Homeroom can read
        $readResponse = $this->actingAs($this->homeroom)->getJson('/api/subjects');
        $readResponse->assertStatus(200);

        // Homeroom cannot create
        $createResponse = $this->actingAs($this->homeroom)->postJson('/api/subjects', [
            'code' => 'BIN',
            'name' => 'Bahasa Indonesia',
        ]);
        $createResponse->assertStatus(403);

        // Homeroom cannot update
        $updateResponse = $this->actingAs($this->homeroom)->putJson("/api/subjects/{$subject->id}", [
            'code' => 'MTK',
            'name' => 'Matematika Dasar',
        ]);
        $updateResponse->assertStatus(403);

        // Homeroom cannot delete
        $deleteResponse = $this->actingAs($this->homeroom)->deleteJson("/api/subjects/{$subject->id}");
        $deleteResponse->assertStatus(403);
    }

    // ===== VERIFICATION: ADMIN FULL CRUD =====
    public function test_admin_can_create_read_update_delete()
    {
        // Create
        $createResponse = $this->actingAs($this->admin)->postJson('/api/subjects', [
            'code' => 'MTK',
            'name' => 'Matematika',
            'credit_hours' => 4,
        ]);
        $createResponse->assertStatus(201);
        $subjectId = $createResponse->json('data.id');

        // Read
        $readResponse = $this->actingAs($this->admin)->getJson("/api/subjects/{$subjectId}");
        $readResponse->assertStatus(200)
            ->assertJsonPath('data.code', 'MTK');

        // Update
        $updateResponse = $this->actingAs($this->admin)->putJson("/api/subjects/{$subjectId}", [
            'code' => 'MTK',
            'name' => 'Matematika Dasar',
            'credit_hours' => 3,
        ]);
        $updateResponse->assertStatus(200)
            ->assertJsonPath('data.name', 'Matematika Dasar');

        // Delete
        $deleteResponse = $this->actingAs($this->admin)->deleteJson("/api/subjects/{$subjectId}");
        $deleteResponse->assertStatus(200);

        // Verify soft delete
        $this->assertSoftDeleted('subjects', ['id' => $subjectId]);
    }

    // ===== VERIFICATION: COMBINED SEARCH + FILTER + SORT =====
    public function test_combined_search_filter_sort_works()
    {
        Subject::create(['code' => 'MTK', 'name' => 'Matematika', 'is_active' => true]);
        Subject::create(['code' => 'MTK2', 'name' => 'Matematika Lanjut', 'is_active' => true]);
        Subject::create(['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson(
            '/api/subjects?search=Matematika&status=active&sort=code&sort_direction=asc'
        );

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        $data = $response->json('data');
        $this->assertEquals('MTK', $data[0]['code']);
        $this->assertEquals('MTK2', $data[1]['code']);
        foreach ($data as $subject) {
            $this->assertTrue($subject['is_active']);
        }
    }
}
