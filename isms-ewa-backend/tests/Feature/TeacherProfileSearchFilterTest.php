<?php

namespace Tests\Feature;

use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherProfileSearchFilterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Test search by name
     */
    public function test_search_by_name()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?search=Budi');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertTrue(count($data) > 0);
        $this->assertStringContainsString('Budi', $data[0]['user']['name']);
    }

    /**
     * Test search by email
     */
    public function test_search_by_email()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?search=teacher@isms-ewa.local');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertTrue(count($data) > 0);
        $this->assertStringContainsString('teacher@isms-ewa.local', $data[0]['user']['email']);
    }

    /**
     * Test search by NIP
     */
    public function test_search_by_nip()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?search=198501151234567');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertTrue(count($data) > 0);
        $this->assertEquals('198501151234567', $data[0]['nip']);
    }

    /**
     * Test search by specialization
     */
    public function test_search_by_specialization()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?search=Matematika');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertTrue(count($data) > 0);
        $this->assertStringContainsString('Matematika', $data[0]['specialization']);
    }

    /**
     * Test filter by status active
     */
    public function test_filter_by_status_active()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?status=active');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertTrue($item['is_active']);
        }
    }

    /**
     * Test filter by status inactive
     */
    public function test_filter_by_status_inactive()
    {
        $admin = User::where('role', 'admin')->first();

        // Deactivate one profile
        $profile = TeacherProfile::first();
        $profile->update(['is_active' => false]);

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?status=inactive');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertFalse($item['is_active']);
        }
    }

    /**
     * Test filter by role teacher
     */
    public function test_filter_by_role_teacher()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?role=teacher');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertEquals('teacher', $item['user']['role']);
        }
    }

    /**
     * Test filter by role homeroom_teacher
     */
    public function test_filter_by_role_homeroom_teacher()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?role=homeroom_teacher');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertEquals('homeroom_teacher', $item['user']['role']);
        }
    }

    /**
     * Test sort by created_at
     */
    public function test_sort_by_created_at()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?sort=created_at&sort_direction=asc');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertTrue(count($data) > 0);
    }

    /**
     * Test sort by nip
     */
    public function test_sort_by_nip()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?sort=nip');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertTrue(count($data) > 0);
    }

    /**
     * Test pagination
     */
    public function test_pagination()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers?per_page=2');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $pagination = $response->json('pagination');
        $this->assertLessThanOrEqual(2, count($response->json('data')));
        $this->assertIsArray($pagination);
        $this->assertArrayHasKey('total', $pagination);
        $this->assertArrayHasKey('per_page', $pagination);
        $this->assertArrayHasKey('current_page', $pagination);
        $this->assertArrayHasKey('last_page', $pagination);
    }

    /**
     * Test dropdown returns only active teachers
     */
    public function test_dropdown_returns_only_active_teachers()
    {
        $admin = User::where('role', 'admin')->first();

        // Deactivate one profile
        $profile = TeacherProfile::first();
        $profile->update(['is_active' => false]);

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers/dropdown');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertTrue($item['is_active']);
        }
    }

    /**
     * Test candidates returns only users without teacher profile
     */
    public function test_candidates_returns_only_users_without_profile()
    {
        $admin = User::where('role', 'admin')->first();

        // Create a new teacher without profile
        $newTeacher = User::create([
            'name' => 'New Teacher Without Profile',
            'email' => 'newteacher@isms-ewa.local',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/users/teacher-candidates');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        
        // Should include new teacher
        $newTeacherFound = false;
        foreach ($data as $item) {
            if ($item['id'] === $newTeacher->id) {
                $newTeacherFound = true;
                break;
            }
        }
        $this->assertTrue($newTeacherFound);

        // Should not include users with existing profile
        $existingTeacher = User::where('email', 'teacher@isms-ewa.local')->first();
        $existingTeacherFound = false;
        foreach ($data as $item) {
            if ($item['id'] === $existingTeacher->id) {
                $existingTeacherFound = true;
                break;
            }
        }
        $this->assertFalse($existingTeacherFound);
    }

    /**
     * Test candidates only returns teacher/homeroom_teacher roles
     */
    public function test_candidates_only_returns_teacher_roles()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/users/teacher-candidates');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertIn($item['role'], ['teacher', 'homeroom_teacher']);
        }
    }
}
