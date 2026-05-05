<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;
use App\Services\ScoringService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = $this->seedUsers();
        $classes = $this->seedClasses($users);
        $profiles = $this->studentProfiles($classes, $users);
        $scoringService = app(ScoringService::class);

        foreach ($profiles as $profile) {
            $student = Student::updateOrCreate(
                ['student_id' => $profile['student']['student_id']],
                $profile['student']
            );

            Grade::query()->where('student_id', $student->id)->delete();
            foreach ($profile['grades'] as $grade) {
                Grade::create(array_merge($grade, ['student_id' => $student->id]));
            }

            Violation::query()->where('student_id', $student->id)->delete();
            foreach ($profile['violations'] as $violation) {
                Violation::create(array_merge($violation, ['student_id' => $student->id]));
            }

            $scoringService->updateStudentRiskScore($student);
        }
    }

    private function seedUsers(): array
    {
        return [
            'admin' => User::updateOrCreate(
                ['email' => 'admin@isms-ewa.local'],
                [
                    'name' => 'Admin User',
                    'password' => Hash::make('password'),
                    'role' => 'admin',
                ]
            ),
            'teacher1' => User::updateOrCreate(
                ['email' => 'teacher1@isms-ewa.local'],
                [
                    'name' => 'John Doe',
                    'password' => Hash::make('password'),
                    'role' => 'homeroom_teacher',
                ]
            ),
            'teacher2' => User::updateOrCreate(
                ['email' => 'teacher2@isms-ewa.local'],
                [
                    'name' => 'Jane Smith',
                    'password' => Hash::make('password'),
                    'role' => 'homeroom_teacher',
                ]
            ),
            'teacher3' => User::updateOrCreate(
                ['email' => 'teacher3@isms-ewa.local'],
                [
                    'name' => 'Sarah Malik',
                    'password' => Hash::make('password'),
                    'role' => 'homeroom_teacher',
                ]
            ),
        ];
    }

    private function seedClasses(array $users): array
    {
        return [
            '10-A' => SchoolClass::updateOrCreate(
                ['name' => 'Class 10-A'],
                [
                    'grade_level' => '10',
                    'homeroom_teacher_id' => $users['teacher1']->id,
                ]
            ),
            '10-B' => SchoolClass::updateOrCreate(
                ['name' => 'Class 10-B'],
                [
                    'grade_level' => '10',
                    'homeroom_teacher_id' => $users['teacher2']->id,
                ]
            ),
            '10-C' => SchoolClass::updateOrCreate(
                ['name' => 'Class 10-C'],
                [
                    'grade_level' => '10',
                    'homeroom_teacher_id' => $users['teacher3']->id,
                ]
            ),
        ];
    }

    private function studentProfiles(array $classes, array $users): array
    {
        return [
            [
                'student' => [
                    'name' => 'Alice Johnson',
                    'email' => 'alice.johnson@example.com',
                    'student_id' => 'STU001',
                    'class_id' => $classes['10-A']->id,
                ],
                'grades' => $this->buildGrades([92, 88, 90, 91]),
                'violations' => [],
            ],
            [
                'student' => [
                    'name' => 'Brian Lee',
                    'email' => 'brian.lee@example.com',
                    'student_id' => 'STU002',
                    'class_id' => $classes['10-A']->id,
                ],
                'grades' => $this->buildGrades([84, 86, 82, 88]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Arrived late for first period', 'severity' => 'minor', 'days_ago' => 18],
                    ],
                    $users['teacher1']->name
                ),
            ],
            [
                'student' => [
                    'name' => 'Chloe Martin',
                    'email' => 'chloe.martin@example.com',
                    'student_id' => 'STU003',
                    'class_id' => $classes['10-A']->id,
                ],
                'grades' => $this->buildGrades([72, 74, 70, 76]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Missed classroom participation task', 'severity' => 'moderate', 'days_ago' => 9],
                    ],
                    $users['teacher1']->name
                ),
            ],
            [
                'student' => [
                    'name' => 'Daniel Cruz',
                    'email' => 'daniel.cruz@example.com',
                    'student_id' => 'STU004',
                    'class_id' => $classes['10-A']->id,
                ],
                'grades' => $this->buildGrades([58, 60, 55, 59]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Skipped supervised study session', 'severity' => 'major', 'days_ago' => 6],
                    ],
                    $users['teacher1']->name
                ),
            ],
            [
                'student' => [
                    'name' => 'Elena Hart',
                    'email' => 'elena.hart@example.com',
                    'student_id' => 'STU005',
                    'class_id' => $classes['10-B']->id,
                ],
                'grades' => $this->buildGrades([88, 90, 84, 86]),
                'violations' => [],
            ],
            [
                'student' => [
                    'name' => 'Farhan Putra',
                    'email' => 'farhan.putra@example.com',
                    'student_id' => 'STU006',
                    'class_id' => $classes['10-B']->id,
                ],
                'grades' => $this->buildGrades([68, 70, 66, 69]),
                'violations' => [],
            ],
            [
                'student' => [
                    'name' => 'Grace Kim',
                    'email' => 'grace.kim@example.com',
                    'student_id' => 'STU007',
                    'class_id' => $classes['10-B']->id,
                ],
                'grades' => $this->buildGrades([81, 83, 85, 80]),
                'violations' => [],
            ],
            [
                'student' => [
                    'name' => 'Hadi Santoso',
                    'email' => 'hadi.santoso@example.com',
                    'student_id' => 'STU008',
                    'class_id' => $classes['10-B']->id,
                ],
                'grades' => $this->buildGrades([62, 58, 60, 57]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Repeatedly left class without permission', 'severity' => 'moderate', 'days_ago' => 4],
                    ],
                    $users['teacher2']->name
                ),
            ],
            [
                'student' => [
                    'name' => 'Inez Rahma',
                    'email' => 'inez.rahma@example.com',
                    'student_id' => 'STU009',
                    'class_id' => $classes['10-C']->id,
                ],
                'grades' => $this->buildGrades([90, 87, 91, 89]),
                'violations' => [],
            ],
            [
                'student' => [
                    'name' => 'Jonah White',
                    'email' => 'jonah.white@example.com',
                    'student_id' => 'STU010',
                    'class_id' => $classes['10-C']->id,
                ],
                'grades' => $this->buildGrades([78, 76, 79, 75]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Incomplete homework submission pattern', 'severity' => 'moderate', 'days_ago' => 12],
                    ],
                    $users['teacher3']->name
                ),
            ],
            [
                'student' => [
                    'name' => 'Kenzie Moore',
                    'email' => 'kenzie.moore@example.com',
                    'student_id' => 'STU011',
                    'class_id' => $classes['10-C']->id,
                ],
                'grades' => $this->buildGrades([69, 67, 66, 68]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Confrontational behavior during group work', 'severity' => 'major', 'days_ago' => 7],
                    ],
                    $users['teacher3']->name
                ),
            ],
            [
                'student' => [
                    'name' => 'Laila Prasetyo',
                    'email' => 'laila.prasetyo@example.com',
                    'student_id' => 'STU012',
                    'class_id' => $classes['10-C']->id,
                ],
                'grades' => $this->buildGrades([82, 84, 80, 86]),
                'violations' => $this->buildViolations(
                    [
                        ['description' => 'Late assignment reminder issued', 'severity' => 'minor', 'days_ago' => 15],
                    ],
                    $users['teacher3']->name
                ),
            ],
        ];
    }

    private function buildGrades(array $scores): array
    {
        $subjects = ['Mathematics', 'English', 'Science', 'History'];

        return array_map(
            fn(string $subject, int $index) => [
                'subject' => $subject,
                'score' => $scores[$index],
                'semester' => '2',
                'academic_year' => '2025/2026',
            ],
            $subjects,
            array_keys($subjects)
        );
    }

    private function buildViolations(array $violations, string $reportedBy): array
    {
        return array_map(
            fn(array $violation) => [
                'description' => $violation['description'],
                'severity' => $violation['severity'],
                'reported_by' => $reportedBy,
                'reported_date' => Carbon::now()->subDays($violation['days_ago'])->toDateString(),
            ],
            $violations
        );
    }
}
