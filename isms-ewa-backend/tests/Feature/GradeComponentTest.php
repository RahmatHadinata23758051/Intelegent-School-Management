<?php

namespace Tests\Feature;

use App\Models\GradeComponent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GradeComponentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /** @test */
    public function admin_can_create_grade_component()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/grade-components', [
            'code' => 'TEST',
            'name' => 'Test Component',
            'description' => 'Test description',
            'default_weight' => 10.00,
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'message', 'data']);

        $this->assertDatabaseHas('grade_components', [
            'code' => 'TEST',
            'name' => 'Test Component',
        ]);
    }

    /** @test */
    public function admin_can_list_grade_components()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'data',
                    'meta',
                ],
            ]);
    }

    /** @test */
    public function admin_can_view_grade_component_detail()
    {
        $admin = User::where('role', 'admin')->first();
        $component = GradeComponent::first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/grade-components/{$component->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'message', 'data']);
    }

    /** @test */
    public function admin_can_update_grade_component()
    {
        $admin = User::where('role', 'admin')->first();
        $component = GradeComponent::first();

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/grade-components/{$component->id}", [
            'code' => $component->code,
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'default_weight' => 15.00,
            'is_active' => true,
            'sort_order' => 5,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('grade_components', [
            'id' => $component->id,
            'name' => 'Updated Name',
        ]);
    }

    /** @test */
    public function admin_can_delete_grade_component()
    {
        $admin = User::where('role', 'admin')->first();
        $component = GradeComponent::create([
            'code' => 'DEL',
            'name' => 'To Delete',
            'is_active' => true,
            'sort_order' => 99,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/grade-components/{$component->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('grade_components', ['id' => $component->id]);
    }

    /** @test */
    public function teacher_can_list_grade_components_read_only()
    {
        $teacher = User::where('role', 'teacher')->first();

        $response = $this->actingAs($teacher, 'sanctum')->getJson('/api/grade-components');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_cannot_create_grade_component()
    {
        $teacher = User::where('role', 'teacher')->first();

        $response = $this->actingAs($teacher, 'sanctum')->postJson('/api/grade-components', [
            'code' => 'TEST',
            'name' => 'Test Component',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function teacher_cannot_update_grade_component()
    {
        $teacher = User::where('role', 'teacher')->first();
        $component = GradeComponent::first();

        $response = $this->actingAs($teacher, 'sanctum')->putJson("/api/grade-components/{$component->id}", [
            'code' => $component->code,
            'name' => 'Updated Name',
            'is_active' => true,
            'sort_order' => 5,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function teacher_cannot_delete_grade_component()
    {
        $teacher = User::where('role', 'teacher')->first();
        $component = GradeComponent::first();

        $response = $this->actingAs($teacher, 'sanctum')->deleteJson("/api/grade-components/{$component->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function homeroom_teacher_can_list_grade_components_read_only()
    {
        $homeroom = User::where('role', 'homeroom_teacher')->first();

        $response = $this->actingAs($homeroom, 'sanctum')->getJson('/api/grade-components');

        $response->assertStatus(200);
    }

    /** @test */
    public function code_must_be_unique()
    {
        $admin = User::where('role', 'admin')->first();
        $existing = GradeComponent::first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/grade-components', [
            'code' => $existing->code,
            'name' => 'Duplicate Code',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    /** @test */
    public function name_is_required()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/grade-components', [
            'code' => 'TEST',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function default_weight_must_be_numeric()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/grade-components', [
            'code' => 'TEST',
            'name' => 'Test',
            'default_weight' => 'not-a-number',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['default_weight']);
    }

    /** @test */
    public function default_weight_must_be_between_0_and_100()
    {
        $admin = User::where('role', 'admin')->first();

        // Test below 0
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/grade-components', [
            'code' => 'TEST1',
            'name' => 'Test 1',
            'default_weight' => -1,
            'is_active' => true,
            'sort_order' => 10,
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['default_weight']);

        // Test above 100
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/grade-components', [
            'code' => 'TEST2',
            'name' => 'Test 2',
            'default_weight' => 101,
            'is_active' => true,
            'sort_order' => 10,
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['default_weight']);
    }

    /** @test */
    public function dropdown_returns_active_grade_components_only()
    {
        $admin = User::where('role', 'admin')->first();

        // Create inactive component
        GradeComponent::create([
            'code' => 'INACTIVE',
            'name' => 'Inactive Component',
            'is_active' => false,
            'sort_order' => 99,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components/dropdown');

        $response->assertStatus(200);
        $data = $response->json('data');

        // All returned components should be active
        foreach ($data as $component) {
            $this->assertTrue(
                GradeComponent::find($component['id'])->is_active,
                "Component {$component['code']} should be active"
            );
        }
    }

    /** @test */
    public function active_endpoint_returns_active_grade_components_only()
    {
        $admin = User::where('role', 'admin')->first();

        // Create inactive component
        GradeComponent::create([
            'code' => 'INACTIVE2',
            'name' => 'Inactive Component 2',
            'is_active' => false,
            'sort_order' => 99,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components/active');

        $response->assertStatus(200);
        $data = $response->json('data');

        // All returned components should be active
        foreach ($data as $component) {
            $dbComponent = GradeComponent::find($component['id']);
            $this->assertTrue($dbComponent->is_active);
        }
    }

    /** @test */
    public function search_by_code_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components?search=TUGAS');

        $response->assertStatus(200);
        $data = $response->json('data.data');

        $this->assertNotEmpty($data);
        $found = false;
        foreach ($data as $component) {
            if (stripos($component['code'], 'TUGAS') !== false) {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found, 'Should find component with TUGAS in code');
    }

    /** @test */
    public function search_by_name_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components?search=Quiz');

        $response->assertStatus(200);
        $data = $response->json('data.data');

        $this->assertNotEmpty($data);
        $found = false;
        foreach ($data as $component) {
            if (stripos($component['name'], 'Quiz') !== false) {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found, 'Should find component with Quiz in name');
    }

    /** @test */
    public function filter_by_active_status_works()
    {
        $admin = User::where('role', 'admin')->first();

        // Create inactive component
        GradeComponent::create([
            'code' => 'INACTIVE3',
            'name' => 'Inactive Component 3',
            'is_active' => false,
            'sort_order' => 99,
        ]);

        // Filter active
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components?status=active');
        $response->assertStatus(200);
        $activeData = $response->json('data.data');
        foreach ($activeData as $component) {
            $this->assertTrue(GradeComponent::find($component['id'])->is_active);
        }

        // Filter inactive
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components?status=inactive');
        $response->assertStatus(200);
        $inactiveData = $response->json('data.data');
        foreach ($inactiveData as $component) {
            $this->assertFalse(GradeComponent::find($component['id'])->is_active);
        }
    }

    /** @test */
    public function pagination_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/grade-components?per_page=2');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'data',
                    'meta' => ['total', 'per_page', 'current_page', 'last_page'],
                ],
            ]);

        $meta = $response->json('data.meta');
        $this->assertEquals(2, $meta['per_page']);
    }
}
