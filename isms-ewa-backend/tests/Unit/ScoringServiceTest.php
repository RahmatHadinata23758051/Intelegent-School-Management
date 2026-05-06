<?php

namespace Tests\Unit;

use App\Models\Grade;
use App\Models\RiskScore;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;
use App\Services\ScoringService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScoringServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $scoringService;
    protected $teacher;
    protected $schoolClass;

    protected function setUp(): void
    {
        parent::setUp();

        $this->scoringService = app(ScoringService::class);

        $this->teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        $this->schoolClass = SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $this->teacher->id,
        ]);
    }

    /**
     * Test academic score >= 85 returns 10
     */
    public function test_academic_score_85_or_above_returns_10()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 85.0,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $score = $this->scoringService->calculateAcademicScore($student);
        $this->assertEquals(10, $score);
    }

    /**
     * Test academic score 75-84.99 returns 25
     */
    public function test_academic_score_75_to_84_returns_25()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 80.0,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $score = $this->scoringService->calculateAcademicScore($student);
        $this->assertEquals(25, $score);
    }

    /**
     * Test academic score 65-74.99 returns 50
     */
    public function test_academic_score_65_to_74_returns_50()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 70.0,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $score = $this->scoringService->calculateAcademicScore($student);
        $this->assertEquals(50, $score);
    }

    /**
     * Test academic score 55-64.99 returns 70
     */
    public function test_academic_score_55_to_64_returns_70()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 60.0,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $score = $this->scoringService->calculateAcademicScore($student);
        $this->assertEquals(70, $score);
    }

    /**
     * Test academic score < 55 returns 100
     */
    public function test_academic_score_below_55_returns_100()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 50.0,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $score = $this->scoringService->calculateAcademicScore($student);
        $this->assertEquals(100, $score);
    }

    /**
     * Test behavioral score minor violation
     */
    public function test_behavioral_score_minor_violation()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Violation::create([
            'student_id' => $student->id,
            'description' => 'Minor violation',
            'severity' => 'minor',
            'reported_by' => $this->teacher->id,
            'reported_date' => now()->toDateString(),
        ]);

        $score = $this->scoringService->calculateBehavioralScore($student);
        $this->assertEquals(5, $score);
    }

    /**
     * Test behavioral score capped at 100
     */
    public function test_behavioral_score_capped_at_100()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        // Create violations that exceed 100
        for ($i = 0; $i < 3; $i++) {
            Violation::create([
                'student_id' => $student->id,
                'description' => 'Severe violation ' . $i,
                'severity' => 'severe',
                'reported_by' => $this->teacher->id,
                'reported_date' => now()->toDateString(),
            ]);
        }

        $score = $this->scoringService->calculateBehavioralScore($student);
        $this->assertEquals(100, $score);
    }

    /**
     * Test total score formula 60/40
     */
    public function test_total_score_formula()
    {
        $academicScore = 50;
        $behavioralScore = 40;

        $totalScore = $this->scoringService->calculateTotalScore($academicScore, $behavioralScore);
        $expected = ($academicScore * 0.6) + ($behavioralScore * 0.4);

        $this->assertEquals(round($expected, 2), $totalScore);
    }

    /**
     * Test risk level safe
     */
    public function test_risk_level_safe()
    {
        $riskLevel = $this->scoringService->determineRiskLevel(20);
        $this->assertEquals('safe', $riskLevel);
    }

    /**
     * Test risk level warning
     */
    public function test_risk_level_warning()
    {
        $riskLevel = $this->scoringService->determineRiskLevel(35);
        $this->assertEquals('warning', $riskLevel);
    }

    /**
     * Test risk level high_risk
     */
    public function test_risk_level_high_risk()
    {
        $riskLevel = $this->scoringService->determineRiskLevel(60);
        $this->assertEquals('high_risk', $riskLevel);
    }

    /**
     * Test update student risk score creates record
     */
    public function test_update_student_risk_score_creates_record()
    {
        $student = Student::create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'student_id' => 'STU001',
            'school_class_id' => $this->schoolClass->id,
        ]);

        Grade::create([
            'student_id' => $student->id,
            'subject' => 'Matematika',
            'score' => 85.0,
            'semester' => '1',
            'academic_year' => '2024/2025',
        ]);

        $riskScore = $this->scoringService->updateStudentRiskScore($student);

        $this->assertNotNull($riskScore);
        $this->assertEquals($student->id, $riskScore->student_id);
        $this->assertDatabaseHas('risk_scores', [
            'student_id' => $student->id,
        ]);
    }
}
