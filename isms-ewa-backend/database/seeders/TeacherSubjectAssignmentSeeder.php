<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassSubject;
use App\Models\TeacherProfile;
use App\Models\TeacherSubjectAssignment;
use Illuminate\Database\Seeder;

class TeacherSubjectAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get active academic year
        $academicYear = AcademicYear::where('is_active', true)->first();
        if (!$academicYear) {
            return;
        }

        // Get teacher profiles
        $teachers = TeacherProfile::active()->get();
        if ($teachers->isEmpty()) {
            return;
        }

        // Get class subjects
        $classSubjects = ClassSubject::active()->with(['schoolClass', 'subject'])->get();
        if ($classSubjects->isEmpty()) {
            return;
        }

        // Sample assignments
        $assignments = [
            // Budi Santoso (teacher_profile_id: 1) - Matematika
            [
                'teacher_name' => 'Budi Santoso',
                'subject_code' => 'MTK',
                'class_names' => ['X-A', 'X-B'],
            ],
            // Siti Nurhaliza (teacher_profile_id: 2) - Bahasa Indonesia
            [
                'teacher_name' => 'Siti Nurhaliza',
                'subject_code' => 'BIN',
                'class_names' => ['X-A', 'X-B'],
            ],
            // Ahmad Wijaya (teacher_profile_id: 3) - IPA & IPS
            [
                'teacher_name' => 'Ahmad Wijaya',
                'subject_code' => 'IPA',
                'class_names' => ['X-A'],
            ],
            [
                'teacher_name' => 'Ahmad Wijaya',
                'subject_code' => 'IPS',
                'class_names' => ['X-B'],
            ],
        ];

        foreach ($assignments as $assignment) {
            // Find teacher by name
            $teacher = $teachers->first(function ($t) use ($assignment) {
                return strpos($t->name, $assignment['teacher_name']) !== false;
            });

            if (!$teacher) {
                continue;
            }

            // Find class subjects by subject code and class names
            foreach ($assignment['class_names'] as $className) {
                $classSubject = $classSubjects->first(function ($cs) use ($assignment, $className) {
                    return $cs->subject->code === $assignment['subject_code']
                        && $cs->schoolClass->name === $className;
                });

                if (!$classSubject) {
                    continue;
                }

                // Create assignment
                TeacherSubjectAssignment::updateOrCreate(
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
    }
}
