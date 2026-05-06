<?php

namespace Tests\Unit;

use App\Models\Grade;
use App\Models\RiskScore;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test relasi schoolClass() mengembalikan instance SchoolClass yang benar
     */
    public function test_school_class_relation()
    {
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $class = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ]);

        $student = Student::create([
            'name' => 'Student Name',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'class_id' => $class->id,
        ]);

        $this->assertEquals($class->id, $student->schoolClass->id);
        $this->assertInstanceOf(SchoolClass::class, $student->schoolClass);
    }

    /**
     * Test relasi grades() mengembalikan collection Grade yang benar
     */
    public function test_grades_relation()
    {
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $class = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ]);

        $student = Student::create([
            'name' => 'Student Name',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'class_id' => $class->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 85.50,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Bahasa Indonesia',
            'score' => 90.00,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $this->assertCount(2, $student->grades);
        $this->assertInstanceOf(Grade::class, $student->grades->first());
    }

    /**
     * Test relasi violations() mengembalikan collection Violation yang benar
     */
    public function test_violations_relation()
    {
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $class = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ]);

        $student = Student::create([
            'name' => 'Student Name',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'class_id' => $class->id,
        ]);

        Violation::create([
            'student_id' => $student->id,
            'description' => 'Terlambat masuk kelas',
            'severity' => 'low',
            'reported_by' => $teacher->id,
            'reported_date' => now()->toDateString(),
        ]);

        $this->assertCount(1, $student->violations);
        $this->assertInstanceOf(Violation::class, $student->violations->first());
    }

    /**
     * Test relasi riskScore() mengembalikan instance RiskScore yang benar
     */
    public function test_risk_score_relation()
    {
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $class = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ]);

        $student = Student::create([
            'name' => 'Student Name',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'class_id' => $class->id,
        ]);

        $riskScore = RiskScore::create([
            'student_id' => $student->id,
            'total_score' => 65.50,
            'academic_score' => 70.00,
            'behavioral_score' => 60.00,
            'risk_level' => 'medium',
            'last_updated' => now(),
        ]);

        $this->assertEquals($riskScore->id, $student->riskScore->id);
        $this->assertInstanceOf(RiskScore::class, $student->riskScore);
    }
}
