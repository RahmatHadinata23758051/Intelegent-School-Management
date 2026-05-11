<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\TeacherSubjectAssignment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherSubjectAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;
    protected $homeroom;
    protected $teacherProfile;
    protected $classSubject;
    protected $academicYear;

    protected function setUp(): void
    {
        parent::setUp();

        // Create users
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->homeroom = User::factory()->create(['role' => 'homeroom_teacher']);

        // Create teacher profile
        $this->teacherProfile = TeacherProfile::factory()->create([
            'user_id' => $this->teacher->id,
            'is_active' => true,
        ]);

        // Create class subject
        $schoolClass = SchoolClass::factory()->create(['name' => 'X-A']);
        $subject = Subject::factory()->create(['is_active' => true]);
        $this->classSubject = ClassSubject::factory()->create([
            'school_class_id' => $schoolClass->id,
            'subject_id' => $subject->id,
            'is_active' => true,
        ]);

        // Create academic year
        $this->academicYear = AcademicYear::factory()->create(['is_active' => true]);
    }

    // ===== CREATE TESTS =====

    public function test_admin_can_create_teacher_subject_assignment()
    {
        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher subject assignment created successfully',
            ]);

        $this->assertDatabaseHas('teacher_subject_assignments', [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ]);
    }

    public function test_teacher_cannot_create_assignment()
    {
        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->teacher)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(403);
    }

    public function test_homeroom_cannot_create_assignment()
    {
        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->homeroom)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(403);
    }

    public function test_duplicate_assignment_rejected()
    {
        TeacherSubjectAssignment::create([
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ]);

        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_inactive_teacher_profile_rejected()
    {
        $inactiveTeacher = TeacherProfile::factory()->create(['is_active' => false]);

        $data = [
            'teacher_profile_id' => $inactiveTeacher->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Profil guru tidak aktif',
            ]);
    }

    public function test_inactive_class_subject_rejected()
    {
        $inactiveClassSubject = ClassSubject::factory()->create(['is_active' => false]);

        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $inactiveClassSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Penugasan kelas-mata pelajaran tidak aktif',
            ]);
    }

    public function test_inactive_subject_rejected()
    {
        $inactiveSubject = Subject::factory()->create(['is_active' => false]);
        $classSubjectWithInactiveSubject = ClassSubject::factory()->create([
            'subject_id' => $inactiveSubject->id,
            'is_active' => true,
        ]);

        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $classSubjectWithInactiveSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Mata pelajaran tidak aktif',
            ]);
    }

    public function test_inactive_academic_year_rejected()
    {
        $inactiveAcademicYear = AcademicYear::factory()->create(['is_active' => false]);

        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $inactiveAcademicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Tahun ajaran tidak aktif',
            ]);
    }

    public function test_teacher_profile_id_required()
    {
        $data = [
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('teacher_profile_id');
    }

    public function test_class_subject_id_required()
    {
        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'academic_year_id' => $this->academicYear->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('class_subject_id');
    }

    public function test_academic_year_id_required()
    {
        $data = [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/teacher-subject-assignments', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('academic_year_id');
    }

    // ===== READ TESTS =====

    public function test_admin_can_list_assignments()
    {
        TeacherSubjectAssignment::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher subject assignments retrieved successfully',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_teacher_can_list_assignments()
    {
        TeacherSubjectAssignment::factory()->count(3)->create();

        $response = $this->actingAs($this->teacher)->getJson('/api/teacher-subject-assignments');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_admin_can_view_assignment_detail()
    {
        $assignment = TeacherSubjectAssignment::factory()->create();

        $response = $this->actingAs($this->admin)->getJson("/api/teacher-subject-assignments/{$assignment->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $assignment->id,
                ],
            ]);
    }

    public function test_teacher_can_view_own_assignment()
    {
        $assignment = TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $this->teacherProfile->id,
        ]);

        $response = $this->actingAs($this->teacher)->getJson("/api/teacher-subject-assignments/{$assignment->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $assignment->id,
                ],
            ]);
    }

    public function test_teacher_cannot_view_other_assignment()
    {
        $otherTeacher = TeacherProfile::factory()->create();
        $assignment = TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $otherTeacher->id,
        ]);

        $response = $this->actingAs($this->teacher)->getJson("/api/teacher-subject-assignments/{$assignment->id}");

        $response->assertStatus(403);
    }

    // ===== UPDATE TESTS =====

    public function test_admin_can_update_assignment_status()
    {
        $assignment = TeacherSubjectAssignment::factory()->create(['is_active' => true]);

        $data = ['is_active' => false];

        $response = $this->actingAs($this->admin)->putJson("/api/teacher-subject-assignments/{$assignment->id}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher subject assignment updated successfully',
            ]);

        $this->assertDatabaseHas('teacher_subject_assignments', [
            'id' => $assignment->id,
            'is_active' => false,
        ]);
    }

    public function test_teacher_cannot_update_assignment()
    {
        $assignment = TeacherSubjectAssignment::factory()->create();

        $data = ['is_active' => false];

        $response = $this->actingAs($this->teacher)->putJson("/api/teacher-subject-assignments/{$assignment->id}", $data);

        $response->assertStatus(403);
    }

    // ===== DELETE TESTS =====

    public function test_admin_can_delete_assignment()
    {
        $assignment = TeacherSubjectAssignment::factory()->create();

        $response = $this->actingAs($this->admin)->deleteJson("/api/teacher-subject-assignments/{$assignment->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher subject assignment removed successfully',
            ]);

        $this->assertSoftDeleted('teacher_subject_assignments', ['id' => $assignment->id]);
    }

    public function test_teacher_cannot_delete_assignment()
    {
        $assignment = TeacherSubjectAssignment::factory()->create();

        $response = $this->actingAs($this->teacher)->deleteJson("/api/teacher-subject-assignments/{$assignment->id}");

        $response->assertStatus(403);
    }

    // ===== FILTER & SEARCH TESTS =====

    public function test_filter_by_teacher_profile_id()
    {
        $teacher1 = TeacherProfile::factory()->create();
        $teacher2 = TeacherProfile::factory()->create();

        TeacherSubjectAssignment::factory()->create(['teacher_profile_id' => $teacher1->id]);
        TeacherSubjectAssignment::factory()->create(['teacher_profile_id' => $teacher2->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/teacher-subject-assignments?teacher_profile_id={$teacher1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_by_academic_year_id()
    {
        $year1 = AcademicYear::factory()->create();
        $year2 = AcademicYear::factory()->create();

        TeacherSubjectAssignment::factory()->create(['academic_year_id' => $year1->id]);
        TeacherSubjectAssignment::factory()->create(['academic_year_id' => $year2->id]);

        $response = $this->actingAs($this->admin)->getJson("/api/teacher-subject-assignments?academic_year_id={$year1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_by_is_active()
    {
        TeacherSubjectAssignment::factory()->create(['is_active' => true]);
        TeacherSubjectAssignment::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?is_active=true');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_teacher_name()
    {
        $user = User::factory()->create(['name' => 'Budi Santoso']);
        $teacher = TeacherProfile::factory()->create(['user_id' => $user->id]);
        TeacherSubjectAssignment::factory()->create(['teacher_profile_id' => $teacher->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?search=Budi');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_teacher_email()
    {
        $user = User::factory()->create(['email' => 'budi@example.com']);
        $teacher = TeacherProfile::factory()->create(['user_id' => $user->id]);
        TeacherSubjectAssignment::factory()->create(['teacher_profile_id' => $teacher->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?search=budi@example.com');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_teacher_nip()
    {
        $teacher = TeacherProfile::factory()->create(['nip' => '123456789']);
        TeacherSubjectAssignment::factory()->create(['teacher_profile_id' => $teacher->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?search=123456789');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_class_name()
    {
        $class = SchoolClass::factory()->create(['name' => 'X-A']);
        $subject = Subject::factory()->create();
        $classSubject = ClassSubject::factory()->create([
            'school_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);
        TeacherSubjectAssignment::factory()->create(['class_subject_id' => $classSubject->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?search=X-A');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_subject_code()
    {
        $subject = Subject::factory()->create(['code' => 'MTK']);
        $classSubject = ClassSubject::factory()->create(['subject_id' => $subject->id]);
        TeacherSubjectAssignment::factory()->create(['class_subject_id' => $classSubject->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?search=MTK');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_by_subject_name()
    {
        $subject = Subject::factory()->create(['name' => 'Matematika']);
        $classSubject = ClassSubject::factory()->create(['subject_id' => $subject->id]);
        TeacherSubjectAssignment::factory()->create(['class_subject_id' => $classSubject->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?search=Matematika');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    // ===== PAGINATION TESTS =====

    public function test_pagination_works()
    {
        TeacherSubjectAssignment::factory()->count(20)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/teacher-subject-assignments?per_page=10');

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

    public function test_get_subjects_by_teacher()
    {
        $teacher = TeacherProfile::factory()->create();
        $subject1 = Subject::factory()->create();
        $subject2 = Subject::factory()->create();
        $classSubject1 = ClassSubject::factory()->create(['subject_id' => $subject1->id]);
        $classSubject2 = ClassSubject::factory()->create(['subject_id' => $subject2->id]);

        TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $teacher->id,
            'class_subject_id' => $classSubject1->id,
            'is_active' => true,
        ]);
        TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $teacher->id,
            'class_subject_id' => $classSubject2->id,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->getJson("/api/teachers/{$teacher->id}/subjects");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subjects taught by teacher retrieved successfully',
            ])
            ->assertJsonCount(2, 'data');
    }

    public function test_get_classes_by_teacher()
    {
        $teacher = TeacherProfile::factory()->create();
        $class1 = SchoolClass::factory()->create();
        $class2 = SchoolClass::factory()->create();
        $subject = Subject::factory()->create();
        $classSubject1 = ClassSubject::factory()->create([
            'school_class_id' => $class1->id,
            'subject_id' => $subject->id,
        ]);
        $classSubject2 = ClassSubject::factory()->create([
            'school_class_id' => $class2->id,
            'subject_id' => $subject->id,
        ]);

        TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $teacher->id,
            'class_subject_id' => $classSubject1->id,
            'is_active' => true,
        ]);
        TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $teacher->id,
            'class_subject_id' => $classSubject2->id,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->getJson("/api/teachers/{$teacher->id}/classes");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Classes taught by teacher retrieved successfully',
            ])
            ->assertJsonCount(2, 'data');
    }

    public function test_assign_teacher_to_class_subject()
    {
        $response = $this->actingAs($this->admin)->postJson(
            "/api/teachers/{$this->teacherProfile->id}/class-subjects/{$this->classSubject->id}",
            ['academic_year_id' => $this->academicYear->id]
        );

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher assigned to class-subject successfully',
            ]);

        $this->assertDatabaseHas('teacher_subject_assignments', [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ]);
    }

    public function test_remove_teacher_from_class_subject()
    {
        TeacherSubjectAssignment::create([
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson(
            "/api/teachers/{$this->teacherProfile->id}/class-subjects/{$this->classSubject->id}",
            ['academic_year_id' => $this->academicYear->id]
        );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Teacher removed from class-subject successfully',
            ]);

        $this->assertSoftDeleted('teacher_subject_assignments', [
            'teacher_profile_id' => $this->teacherProfile->id,
            'class_subject_id' => $this->classSubject->id,
            'academic_year_id' => $this->academicYear->id,
        ]);
    }

    // ===== RBAC TESTS =====

    public function test_teacher_read_only_access()
    {
        $assignment = TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $this->teacherProfile->id,
        ]);

        // Can view
        $response = $this->actingAs($this->teacher)->getJson("/api/teacher-subject-assignments/{$assignment->id}");
        $response->assertStatus(200);

        // Cannot update
        $response = $this->actingAs($this->teacher)->putJson(
            "/api/teacher-subject-assignments/{$assignment->id}",
            ['is_active' => false]
        );
        $response->assertStatus(403);

        // Cannot delete
        $response = $this->actingAs($this->teacher)->deleteJson("/api/teacher-subject-assignments/{$assignment->id}");
        $response->assertStatus(403);
    }

    public function test_homeroom_read_only_access()
    {
        $homeroomTeacher = TeacherProfile::factory()->create([
            'user_id' => $this->homeroom->id,
        ]);

        $assignment = TeacherSubjectAssignment::factory()->create([
            'teacher_profile_id' => $homeroomTeacher->id,
        ]);

        // Can view
        $response = $this->actingAs($this->homeroom)->getJson("/api/teacher-subject-assignments/{$assignment->id}");
        $response->assertStatus(200);

        // Cannot update
        $response = $this->actingAs($this->homeroom)->putJson(
            "/api/teacher-subject-assignments/{$assignment->id}",
            ['is_active' => false]
        );
        $response->assertStatus(403);

        // Cannot delete
        $response = $this->actingAs($this->homeroom)->deleteJson("/api/teacher-subject-assignments/{$assignment->id}");
        $response->assertStatus(403);
    }
}
