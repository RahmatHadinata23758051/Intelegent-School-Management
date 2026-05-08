<?php

namespace Tests\Feature;

use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassSubjectTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;
    protected $homeroom;
    protected $schoolClass;
    protected $subject;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->homeroom = User::factory()->create(['role' => 'homeroom_teacher']);

        $this->schoolClass = SchoolClass::factory()->create(['name' => 'X-A']);
        $this->subject = Subject::factory()->create(['is_active' => true]);
    }

    // ===== CREATE TESTS =====

    public function test_admin_can_assign_subject_to_class()
    {
        $data = [
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/class-subjects', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Class subject assigned successfully',
            ]);

        $this->assertDatabaseHas('class_subjects', [
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
        ]);
    }

    public function test_teacher_cannot_assign_subject_to_class()
    {
        $data = [
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
        ];

        $response = $this->actingAs($this->teacher)->postJson('/api/class-subjects', $data);

        $response->assertStatus(403);
    }

    public function test_homeroom_cannot_assign_subject_to_class()
    {
        $data = [
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
        ];

        $response = $this->actingAs($this->homeroom)->postJson('/api/class-subjects', $data);

        $response->assertStatus(403);
    }

    public function test_cannot_assign_duplicate_subject_to_same_class()
    {
        ClassSubject::create([
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
        ]);

        $data = [
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/class-subjects', $data);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_cannot_assign_inactive_subject()
    {
        $inactiveSubject = Subject::factory()->create(['is_active' => false]);

        $data = [
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $inactiveSubject->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/class-subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('subject_id');
    }

    public function test_school_class_id_is_required()
    {
        $data = [
            'subject_id' => $this->subject->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/class-subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('school_class_id');
    }

    public function test_subject_id_is_required()
    {
        $data = [
            'school_class_id' => $this->schoolClass->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/class-subjects', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('subject_id');
    }

    // ===== READ TESTS =====

    public function test_admin_can_list_class_subjects()
    {
        ClassSubject::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/class-subjects');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Class subjects retrieved successfully',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_teacher_can_list_class_subjects()
    {
        ClassSubject::factory()->count(3)->create();

        $response = $this->actingAs($this->teacher)->getJson('/api/class-subjects');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_homeroom_can_list_class_subjects()
    {
        ClassSubject::factory()->count(3)->create();

        $response = $this->actingAs($this->homeroom)->getJson('/api/class-subjects');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_admin_can_view_class_subject_detail()
    {
        $classSubject = ClassSubject::factory()->create();

        $response = $this->actingAs($this->admin)->getJson("/api/class-subjects/{$classSubject->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $classSubject->id,
                ],
            ]);
    }

    // ===== UPDATE TESTS =====

    public function test_admin_can_update_class_subject_status()
    {
        $classSubject = ClassSubject::factory()->create(['is_active' => true]);

        $data = ['is_active' => false];

        $response = $this->actingAs($this->admin)->putJson("/api/class-subjects/{$classSubject->id}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Class subject updated successfully',
            ]);

        $this->assertDatabaseHas('class_subjects', [
            'id' => $classSubject->id,
            'is_active' => false,
        ]);
    }

    public function test_teacher_cannot_update_class_subject()
    {
        $classSubject = ClassSubject::factory()->create();

        $data = ['is_active' => false];

        $response = $this->actingAs($this->teacher)->putJson("/api/class-subjects/{$classSubject->id}", $data);

        $response->assertStatus(403);
    }

    // ===== DELETE TESTS =====

    public function test_admin_can_delete_class_subject()
    {
        $classSubject = ClassSubject::factory()->create();

        $response = $this->actingAs($this->admin)->deleteJson("/api/class-subjects/{$classSubject->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Class subject removed successfully',
            ]);

        $this->assertSoftDeleted('class_subjects', ['id' => $classSubject->id]);
    }

    public function test_teacher_cannot_delete_class_subject()
    {
        $classSubject = ClassSubject::factory()->create();

        $response = $this->actingAs($this->teacher)->deleteJson("/api/class-subjects/{$classSubject->id}");

        $response->assertStatus(403);
    }

    // ===== FILTER & SEARCH TESTS =====

    public function test_filter_by_school_class_id()
    {
        $class1 = SchoolClass::factory()->create();
        $class2 = SchoolClass::factory()->create();
        $subject = Subject::factory()->create();

        ClassSubject::create(['school_class_id' => $class1->id, 'subject_id' => $subject->id]);
        ClassSubject::create(['school_class_id' => $class2->id, 'subject_id' => $subject->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/class-subjects?school_class_id={$class1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_by_subject_id()
    {
        $class = SchoolClass::factory()->create();
        $subject1 = Subject::factory()->create();
        $subject2 = Subject::factory()->create();

        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject1->id]);
        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject2->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/class-subjects?subject_id={$subject1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_by_active_status()
    {
        ClassSubject::factory()->create(['is_active' => true]);
        ClassSubject::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/class-subjects?status=active');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_subject_name()
    {
        $class = SchoolClass::factory()->create();
        $subject = Subject::factory()->create(['name' => 'Matematika']);

        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/class-subjects?search=Matematika');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_subject_code()
    {
        $class = SchoolClass::factory()->create();
        $subject = Subject::factory()->create(['code' => 'MTK']);

        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/class-subjects?search=MTK');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_class_name()
    {
        $class = SchoolClass::factory()->create(['name' => 'X-A']);
        $subject = Subject::factory()->create();

        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/class-subjects?search=X-A');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    // ===== PAGINATION TESTS =====

    public function test_pagination_works()
    {
        ClassSubject::factory()->count(20)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/class-subjects?per_page=10');

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

    // ===== ADDITIONAL ENDPOINTS TESTS =====

    public function test_get_subjects_by_class()
    {
        $class = SchoolClass::factory()->create();
        $subject1 = Subject::factory()->create();
        $subject2 = Subject::factory()->create();

        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject1->id]);
        ClassSubject::create(['school_class_id' => $class->id, 'subject_id' => $subject2->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/classes/{$class->id}/subjects");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subjects for class retrieved successfully',
            ])
            ->assertJsonCount(2, 'data');
    }

    public function test_get_classes_by_subject()
    {
        $class1 = SchoolClass::factory()->create();
        $class2 = SchoolClass::factory()->create();
        $subject = Subject::factory()->create();

        ClassSubject::create(['school_class_id' => $class1->id, 'subject_id' => $subject->id]);
        ClassSubject::create(['school_class_id' => $class2->id, 'subject_id' => $subject->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/subjects/{$subject->id}/classes");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Classes for subject retrieved successfully',
            ])
            ->assertJsonCount(2, 'data');
    }

    public function test_assign_subject_to_class_shortcut()
    {
        $response = $this->actingAs($this->admin)->postJson(
            "/api/classes/{$this->schoolClass->id}/subjects/{$this->subject->id}"
        );

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Subject assigned to class successfully',
            ]);
    }

    public function test_remove_subject_from_class_shortcut()
    {
        ClassSubject::create([
            'school_class_id' => $this->schoolClass->id,
            'subject_id' => $this->subject->id,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson(
            "/api/classes/{$this->schoolClass->id}/subjects/{$this->subject->id}"
        );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subject removed from class successfully',
            ]);
    }
}
