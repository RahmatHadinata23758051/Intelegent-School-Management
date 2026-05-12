<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\GradeComponent;
use App\Models\Semester;
use App\Models\Student;
use App\Models\TeacherSubjectAssignment;
use App\Models\User;
use App\Models\WeeklyGrade;
use Illuminate\Database\Seeder;

class WeeklyGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get active academic year and semester
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        if (!$academicYear || !$semester) {
            $this->command->warn('⚠️  No active academic year or semester found. Skipping weekly grades seeding.');
            return;
        }

        // Get or create class subjects for existing classes
        $classes = \App\Models\SchoolClass::all();
        $subjects = \App\Models\Subject::active()->get();
        $teachers = \App\Models\TeacherProfile::active()->get();

        if ($classes->isEmpty() || $subjects->isEmpty() || $teachers->isEmpty()) {
            $this->command->warn('⚠️  Missing classes, subjects, or teachers. Skipping weekly grades seeding.');
            return;
        }

        // Create class subjects for each class
        foreach ($classes as $class) {
            foreach ($subjects->take(3) as $subject) { // Assign first 3 subjects to each class
                $classSubject = \App\Models\ClassSubject::firstOrCreate(
                    [
                        'school_class_id' => $class->id,
                        'subject_id' => $subject->id,
                    ],
                    [
                        'is_active' => true,
                    ]
                );

                // Create teacher assignment for this class subject
                $teacher = $teachers->random(); // Random teacher
                TeacherSubjectAssignment::firstOrCreate(
                    [
                        'teacher_profile_id' => $teacher->id,
                        'class_subject_id' => $classSubject->id,
                        'academic_year_id' => $academicYear->id,
                    ],
                    [
                        'is_active' => true,
                    ]
                );
            }
        }

        // Now get all assignments
        $assignments = TeacherSubjectAssignment::with(['classSubject.schoolClass'])->get();

        if ($assignments->isEmpty()) {
            $this->command->warn('⚠️  No teacher subject assignments found. Skipping weekly grades seeding.');
            return;
        }

        // Get grade components
        $components = GradeComponent::where('is_active', true)
            ->whereIn('code', ['TUGAS', 'QUIZ', 'WEEKLY'])
            ->get();

        if ($components->isEmpty()) {
            $this->command->warn('⚠️  No active grade components found. Skipping weekly grades seeding.');
            return;
        }

        // Get admin user for recorded_by
        $admin = User::where('role', 'admin')->first();

        $totalGrades = 0;

        // For each assignment, create weekly grades for students
        foreach ($assignments as $assignment) {
            // Get students in this class
            $students = Student::where('school_class_id', $assignment->classSubject->school_class_id)
                ->get();

            if ($students->isEmpty()) {
                continue;
            }

            // Create grades for weeks 1-4 with different components
            for ($week = 1; $week <= 4; $week++) {
                foreach ($components as $component) {
                    foreach ($students as $student) {
                        // Generate realistic scores (60-100)
                        // Some students get lower scores for risk scoring later
                        $baseScore = rand(60, 100);
                        
                        // 20% chance of low score (below 70)
                        if (rand(1, 100) <= 20) {
                            $score = rand(60, 69);
                        } else {
                            $score = $baseScore;
                        }

                        WeeklyGrade::updateOrCreate(
                            [
                                'student_id' => $student->id,
                                'teacher_subject_assignment_id' => $assignment->id,
                                'grade_component_id' => $component->id,
                                'academic_year_id' => $academicYear->id,
                                'semester_id' => $semester->id,
                                'week_number' => $week,
                            ],
                            [
                                'score' => $score,
                                'assessment_date' => now()->subWeeks(4 - $week)->toDateString(),
                                'notes' => $score < 70 ? 'Perlu perhatian khusus' : null,
                                'recorded_by' => $admin?->id,
                            ]
                        );

                        $totalGrades++;
                    }
                }
            }
        }

        $this->command->info("✅ {$totalGrades} weekly grades seeded successfully");
    }
}
