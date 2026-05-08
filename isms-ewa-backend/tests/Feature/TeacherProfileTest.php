<?php

namespace Tests\Feature;

use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Test admin can create teacher profile
     */
    public function test_admin_can_create_teacher_profile()
    {
        $admin = User::where('role', 'admin')->first();
        
        // Create a new teacher user without profile
        $teacher = User::create([
            'name' => 'New Teacher',
            'email' => 'newteacher@isms-ewa.local',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $response = $this->actingAs($admin)
            ->postJson('/api/teachers', [
                'user_id' => $teacher->id,
                'nip' => '999999999999999',
                'qualification' => 'S1 Pendidikan Matematika',
                'specialization' => 'Matematika',
                'phone' => '081234567890',
                'address' => 'Jl. Merdeka No. 123',
                'employment_status' => 'permanent',
                'joined_date' => '2020-01-15',
                'is_active' => true,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher profile created successfully',
            ]);

        $this->assertDatabaseHas('teacher_profiles', [
            'user_id' => $teacher->id,
            'nip' => '999999999999999',
        ]);
    }

    /**
     * Test admin can list teacher profiles
     */
    public function test_admin_can_list_teacher_profiles()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher profiles retrieved successfully',
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'user',
                        'nip',
                        'qualification',
                        'specialization',
                        'is_active',
                    ],
                ],
                'pagination',
            ]);
    }

    /**
     * Test admin can view teacher profile detail
     */
    public function test_admin_can_view_teacher_profile_detail()
    {
        $admin = User::where('role', 'admin')->first();
        $teacherProfile = TeacherProfile::first();

        $response = $this->actingAs($admin)
            ->getJson("/api/teachers/{$teacherProfile->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher profile retrieved successfully',
            ]);
    }

    /**
     * Test admin can update teacher profile
     */
    public function test_admin_can_update_teacher_profile()
    {
        $admin = User::where('role', 'admin')->first();
        $teacherProfile = TeacherProfile::first();

        $response = $this->actingAs($admin)
            ->putJson("/api/teachers/{$teacherProfile->id}", [
                'qualification' => 'S2 Pendidikan Matematika',
                'specialization' => 'Matematika Lanjut',
                'phone' => '081234567899',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher profile updated successfully',
            ]);

        $this->assertDatabaseHas('teacher_profiles', [
            'id' => $teacherProfile->id,
            'qualification' => 'S2 Pendidikan Matematika',
        ]);
    }

    /**
     * Test admin can delete teacher profile
     */
    public function test_admin_can_delete_teacher_profile()
    {
        $admin = User::where('role', 'admin')->first();
        $teacherProfile = TeacherProfile::first();

        $response = $this->actingAs($admin)
            ->deleteJson("/api/teachers/{$teacherProfile->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher profile deleted successfully',
            ]);

        // Check soft delete
        $this->assertSoftDeleted('teacher_profiles', [
            'id' => $teacherProfile->id,
        ]);
    }

    /**
     * Test teacher can list teacher profiles (read-only)
     */
    public function test_teacher_can_list_teacher_profiles()
    {
        $teacher = User::where('role', 'teacher')->first();

        $response = $this->actingAs($teacher)
            ->getJson('/api/teachers');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test teacher cannot create teacher profile
     */
    public function test_teacher_cannot_create_teacher_profile()
    {
        $teacher = User::where('role', 'teacher')->first();
        $anotherTeacher = User::where('role', 'teacher')->where('id', '!=', $teacher->id)->first();

        if (!$anotherTeacher) {
            $anotherTeacher = User::create([
                'name' => 'Another Teacher',
                'email' => 'another@isms-ewa.local',
                'password' => bcrypt('password'),
                'role' => 'teacher',
            ]);
        }

        $response = $this->actingAs($teacher)
            ->postJson('/api/teachers', [
                'user_id' => $anotherTeacher->id,
                'nip' => '198501151234567',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test teacher cannot update teacher profile
     */
    public function test_teacher_cannot_update_teacher_profile()
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherProfile = TeacherProfile::first();

        $response = $this->actingAs($teacher)
            ->putJson("/api/teachers/{$teacherProfile->id}", [
                'qualification' => 'S2',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test teacher cannot delete teacher profile
     */
    public function test_teacher_cannot_delete_teacher_profile()
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherProfile = TeacherProfile::first();

        $response = $this->actingAs($teacher)
            ->deleteJson("/api/teachers/{$teacherProfile->id}");

        $response->assertStatus(403);
    }

    /**
     * Test homeroom teacher can list teacher profiles (read-only)
     */
    public function test_homeroom_teacher_can_list_teacher_profiles()
    {
        $homeroom = User::where('role', 'homeroom_teacher')->first();

        $response = $this->actingAs($homeroom)
            ->getJson('/api/teachers');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test cannot create teacher profile for admin user
     */
    public function test_cannot_create_teacher_profile_for_admin_user()
    {
        $admin = User::where('role', 'admin')->first();
        $anotherAdmin = User::create([
            'name' => 'Another Admin',
            'email' => 'another-admin@isms-ewa.local',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->postJson('/api/teachers', [
                'user_id' => $anotherAdmin->id,
                'nip' => '198501151234567',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('user_id');
    }

    /**
     * Test cannot create duplicate teacher profile for same user
     */
    public function test_cannot_create_duplicate_teacher_profile_for_same_user()
    {
        $admin = User::where('role', 'admin')->first();
        $teacher = User::where('role', 'teacher')->first();

        $response = $this->actingAs($admin)
            ->postJson('/api/teachers', [
                'user_id' => $teacher->id,
                'nip' => '999999999999999',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('user_id');
    }

    /**
     * Test NIP must be unique if provided
     */
    public function test_nip_must_be_unique_if_provided()
    {
        $admin = User::where('role', 'admin')->first();
        $existingProfile = TeacherProfile::first();
        $teacher = User::where('role', 'teacher')->where('id', '!=', $existingProfile->user_id)->first();

        if (!$teacher) {
            $teacher = User::create([
                'name' => 'New Teacher',
                'email' => 'new-teacher@isms-ewa.local',
                'password' => bcrypt('password'),
                'role' => 'teacher',
            ]);
        }

        $response = $this->actingAs($admin)
            ->postJson('/api/teachers', [
                'user_id' => $teacher->id,
                'nip' => $existingProfile->nip, // Use existing NIP
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('nip');
    }

    /**
     * Test dropdown returns active teachers only
     */
    public function test_dropdown_returns_active_teachers_only()
    {
        $admin = User::where('role', 'admin')->first();

        // Deactivate one profile
        $profile = TeacherProfile::first();
        $profile->update(['is_active' => false]);

        $response = $this->actingAs($admin)
            ->getJson('/api/teachers/dropdown');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher dropdown retrieved successfully',
            ]);

        // Check that all returned profiles are active
        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertTrue($item['is_active']);
        }
    }
}
