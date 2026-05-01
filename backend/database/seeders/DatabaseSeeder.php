<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Violation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@isms-ewa.local',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $teacher1 = User::create([
            'name' => 'John Doe',
            'email' => 'teacher1@isms-ewa.local',
            'password' => Hash::make('password'),
            'role' => 'homeroom_teacher',
        ]);

        $teacher2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'teacher2@isms-ewa.local',
            'password' => Hash::make('password'),
            'role' => 'homeroom_teacher',
        ]);

        $class1 = SchoolClass::create([
            'name' => 'Class 10-A',
            'grade_level' => '10',
            'homeroom_teacher_id' => $teacher1->id,
        ]);

        $class2 = SchoolClass::create([
            'name' => 'Class 10-B',
            'grade_level' => '10',
            'homeroom_teacher_id' => $teacher2->id,
        ]);

        $students = [
            ['name' => 'Alice Johnson', 'email' => 'alice@example.com', 'student_id' => 'STU001'],
            ['name' => 'Bob Williams', 'email' => 'bob@example.com', 'student_id' => 'STU002'],
            ['name' => 'Charlie Brown', 'email' => 'charlie@example.com', 'student_id' => 'STU003'],
            ['name' => 'Diana Prince', 'email' => 'diana@example.com', 'student_id' => 'STU004'],
            ['name' => 'Eve Davis', 'email' => 'eve@example.com', 'student_id' => 'STU005'],
        ];

        foreach ($students as $index => $studentData) {
            $student = Student::create([
                ...$studentData,
                'class_id' => $index % 2 === 0 ? $class1->id : $class2->id,
            ]);

            // Add grades
            $grades = [
                ['subject' => 'Math', 'score' => 85, 'semester' => '1', 'academic_year' => '2024'],
                ['subject' => 'English', 'score' => 78, 'semester' => '1', 'academic_year' => '2024'],
                ['subject' => 'Science', 'score' => 92, 'semester' => '1', 'academic_year' => '2024'],
                ['subject' => 'History', 'score' => 88, 'semester' => '1', 'academic_year' => '2024'],
            ];

            foreach ($grades as $gradeData) {
                Grade::create([...$gradeData, 'student_id' => $student->id]);
            }

            // Add violations randomly
            if ($index > 2) {
                Violation::create([
                    'student_id' => $student->id,
                    'description' => 'Arrived late to class',
                    'severity' => 'minor',
                    'reported_by' => $teacher1->name,
                    'reported_date' => now()->subDays(5),
                ]);
            }
        }
    }
}
