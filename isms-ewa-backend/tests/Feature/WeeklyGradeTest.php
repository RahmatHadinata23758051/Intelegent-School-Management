<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\GradeComponent;
use App\Models\Semester;
use App\Models\Student;
use App\Models\TeacherSubjectAssignment;
use App\Models\User;
use App\Models\WeeklyGrade;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WeeklyGradeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /** @test */
    public function admin_can_input_weekly_grade()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $assignment = TeacherSubjectAssignment::first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 10,
            'score' => 85.5,
            'notes' => 'Good performance',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('weekly_grades', [
            'student_id' => $student->id,
            'week_number' => 10,
            'score' => 85.5,
        ]);
    }

    /** @test */
    public function admin_can_list_weekly_grades()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/weekly-grades');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['data', 'meta'],
            ]);
    }

    /** @test */
    public function admin_can_view_weekly_grade_detail()
    {
        $admin = User::where('role', 'admin')->first();
        $grade = WeeklyGrade::first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/weekly-grades/{$grade->id}");

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_update_weekly_grade()
    {
        $admin = User::where('role', 'admin')->first();
        $grade = WeeklyGrade::first();

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/weekly-grades/{$grade->id}", [
            'score' => 90.0,
            'notes' => 'Updated score',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('weekly_grades', [
            'id' => $grade->id,
            'score' => 90.0,
        ]);
    }

    /** @test */
    public function admin_can_delete_weekly_grade()
    {
        $admin = User::where('role', 'admin')->first();
        $grade = WeeklyGrade::first();

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/weekly-grades/{$grade->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('weekly_grades', ['id' => $grade->id]);
    }

    /** @test */
    public function teacher_can_input_weekly_grade_for_assigned_class_subject()
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherProfile = $teacher->teacherProfile;
        
        // Get assignment for this teacher
        $assignment = TeacherSubjectAssignment::where('teacher_profile_id', $teacherProfile->id)->first();
        
        if (!$assignment) {
            $this->markTestSkipped('No teacher assignment found');
        }

        $student = Student::where('school_class_id', $assignment->classSubject->school_class_id)->first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($teacher, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 11,
            'score' => 88.0,
        ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function teacher_cannot_input_weekly_grade_for_unassigned_class_subject()
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherProfile = $teacher->teacherProfile;
        
        // Get assignment NOT for this teacher
        $assignment = TeacherSubjectAssignment::where('teacher_profile_id', '!=', $teacherProfile->id)->first();
        
        if (!$assignment) {
            $this->markTestSkipped('No other teacher assignment found');
        }

        $student = Student::where('school_class_id', $assignment->classSubject->school_class_id)->first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($teacher, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 12,
            'score' => 88.0,
        ]);

        // Should be forbidden (403) or validation error (400/422) if student validation happens first
        $this->assertContains($response->status(), [400, 403, 422]);
    }

    /** @test */
    public function cannot_input_grade_for_student_outside_assignment_class()
    {
        $admin = User::where('role', 'admin')->first();
        $assignment = TeacherSubjectAssignment::first();
        
        // Get student from different class
        $student = Student::where('school_class_id', '!=', $assignment->classSubject->school_class_id)->first();
        
        if (!$student) {
            $this->markTestSkipped('No student from different class found');
        }

        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 13,
            'score' => 88.0,
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function cannot_input_inactive_grade_component()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $assignment = TeacherSubjectAssignment::first();
        
        // Create inactive component
        $component = GradeComponent::create([
            'code' => 'INACTIVE_TEST',
            'name' => 'Inactive Test',
            'is_active' => false,
            'sort_order' => 99,
        ]);

        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 14,
            'score' => 88.0,
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function cannot_input_invalid_score_below_0()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $assignment = TeacherSubjectAssignment::first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 15,
            'score' => -1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['score']);
    }

    /** @test */
    public function cannot_input_invalid_score_above_100()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $assignment = TeacherSubjectAssignment::first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 16,
            'score' => 101,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['score']);
    }

    /** @test */
    public function cannot_input_invalid_week_below_1()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $assignment = TeacherSubjectAssignment::first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 0,
            'score' => 85,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['week_number']);
    }

    /** @test */
    public function cannot_input_invalid_week_above_52()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();
        $assignment = TeacherSubjectAssignment::first();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $student->id,
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 53,
            'score' => 85,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['week_number']);
    }

    /** @test */
    public function cannot_input_duplicate_weekly_grade_manually()
    {
        $admin = User::where('role', 'admin')->first();
        $grade = WeeklyGrade::first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades', [
            'student_id' => $grade->student_id,
            'teacher_subject_assignment_id' => $grade->teacher_subject_assignment_id,
            'grade_component_id' => $grade->grade_component_id,
            'academic_year_id' => $grade->academic_year_id,
            'semester_id' => $grade->semester_id,
            'week_number' => $grade->week_number,
            'score' => 90,
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function bulk_input_weekly_grades_works()
    {
        $admin = User::where('role', 'admin')->first();
        $assignment = TeacherSubjectAssignment::first();
        $students = Student::where('school_class_id', $assignment->classSubject->school_class_id)->take(2)->get();
        $component = GradeComponent::where('is_active', true)->first();
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades/bulk', [
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $component->id,
            'academic_year_id' => $academicYear->id,
            'semester_id' => $semester->id,
            'week_number' => 20,
            'grades' => [
                ['student_id' => $students[0]->id, 'score' => 85],
                ['student_id' => $students[1]->id, 'score' => 90],
            ],
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('weekly_grades', [
            'student_id' => $students[0]->id,
            'week_number' => 20,
            'score' => 85,
        ]);
    }

    /** @test */
    public function bulk_input_upsert_works()
    {
        $admin = User::where('role', 'admin')->first();
        $grade = WeeklyGrade::first();
        $assignment = $grade->teacherSubjectAssignment;
        $students = Student::where('school_class_id', $assignment->classSubject->school_class_id)->take(2)->get();

        // First bulk input
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades/bulk', [
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $grade->grade_component_id,
            'academic_year_id' => $grade->academic_year_id,
            'semester_id' => $grade->semester_id,
            'week_number' => 21,
            'grades' => [
                ['student_id' => $students[0]->id, 'score' => 75],
            ],
        ]);
        $response->assertStatus(200);

        // Second bulk input (upsert)
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/weekly-grades/bulk', [
            'teacher_subject_assignment_id' => $assignment->id,
            'grade_component_id' => $grade->grade_component_id,
            'academic_year_id' => $grade->academic_year_id,
            'semester_id' => $grade->semester_id,
            'week_number' => 21,
            'grades' => [
                ['student_id' => $students[0]->id, 'score' => 95], // Updated score
            ],
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('weekly_grades', [
            'student_id' => $students[0]->id,
            'week_number' => 21,
            'score' => 95, // Should be updated
        ]);
    }

    /** @test */
    public function teacher_can_update_own_assignment_weekly_grade()
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherProfile = $teacher->teacherProfile;
        
        $grade = WeeklyGrade::whereHas('teacherSubjectAssignment', function ($q) use ($teacherProfile) {
            $q->where('teacher_profile_id', $teacherProfile->id);
        })->first();

        if (!$grade) {
            $this->markTestSkipped('No grade for this teacher found');
        }

        $response = $this->actingAs($teacher, 'sanctum')->putJson("/api/weekly-grades/{$grade->id}", [
            'score' => 92.0,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_cannot_update_other_teacher_grade()
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherProfile = $teacher->teacherProfile;
        
        $grade = WeeklyGrade::whereHas('teacherSubjectAssignment', function ($q) use ($teacherProfile) {
            $q->where('teacher_profile_id', '!=', $teacherProfile->id);
        })->first();

        if (!$grade) {
            $this->markTestSkipped('No grade from other teacher found');
        }

        $response = $this->actingAs($teacher, 'sanctum')->putJson("/api/weekly-grades/{$grade->id}", [
            'score' => 92.0,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function get_class_weekly_grades_recap_works()
    {
        $admin = User::where('role', 'admin')->first();
        $assignment = TeacherSubjectAssignment::first();
        $classId = $assignment->classSubject->school_class_id;

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/classes/{$classId}/weekly-grades");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'class_average_score',
                    'total_students',
                    'total_records',
                    'students',
                ],
            ]);
    }

    /** @test */
    public function get_student_weekly_grades_recap_works()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/weekly-grades");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'student',
                    'grades' => [
                        'average_score',
                        'total_records',
                        'subjects',
                    ],
                ],
            ]);
    }

    /** @test */
    public function weekly_grades_summary_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/weekly-grades/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_records',
                    'average_score',
                    'total_students',
                    'score_distribution',
                ],
            ]);
    }

    /** @test */
    public function average_score_calculation_works()
    {
        $admin = User::where('role', 'admin')->first();
        $student = Student::first();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/students/{$student->id}/weekly-grades");

        $response->assertStatus(200);
        $data = $response->json('data.grades');
        
        // Verify average_score exists and is numeric
        $this->assertArrayHasKey('average_score', $data);
        $this->assertIsNumeric($data['average_score']);
    }

    /** @test */
    public function filter_by_class_works()
    {
        $admin = User::where('role', 'admin')->first();
        $assignment = TeacherSubjectAssignment::first();
        $classId = $assignment->classSubject->school_class_id;

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/weekly-grades?school_class_id={$classId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function filter_by_subject_works()
    {
        $admin = User::where('role', 'admin')->first();
        $assignment = TeacherSubjectAssignment::first();
        $subjectId = $assignment->classSubject->subject_id;

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/weekly-grades?subject_id={$subjectId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function filter_by_week_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/weekly-grades?week_number=1');

        $response->assertStatus(200);
    }

    /** @test */
    public function filter_by_score_range_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/weekly-grades?min_score=80&max_score=90');

        $response->assertStatus(200);
    }

    /** @test */
    public function pagination_works()
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/weekly-grades?per_page=5');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'data',
                    'meta' => ['total', 'per_page', 'current_page', 'last_page'],
                ],
            ]);

        $meta = $response->json('data.meta');
        $this->assertEquals(5, $meta['per_page']);
    }
}
