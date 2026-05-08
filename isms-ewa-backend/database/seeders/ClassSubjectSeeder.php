<?php

namespace Database\Seeders;

use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class ClassSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all classes and subjects
        $classes = SchoolClass::all();
        $subjects = Subject::active()->get();

        if ($classes->isEmpty() || $subjects->isEmpty()) {
            return;
        }

        // Sample assignments
        $assignments = [
            // Class X-A
            [
                'class_name' => 'X-A',
                'subject_codes' => ['MTK', 'BIN', 'BIG', 'IPA', 'PKN'],
            ],
            // Class X-B
            [
                'class_name' => 'X-B',
                'subject_codes' => ['MTK', 'BIN', 'BIG', 'IPS', 'SENI'],
            ],
            // Class XI-A
            [
                'class_name' => 'XI-A',
                'subject_codes' => ['MTK', 'BIN', 'BIG', 'IPA', 'PJOK'],
            ],
            // Class XI-B
            [
                'class_name' => 'XI-B',
                'subject_codes' => ['MTK', 'BIN', 'BIG', 'IPS', 'PKN'],
            ],
            // Class XII-A
            [
                'class_name' => 'XII-A',
                'subject_codes' => ['MTK', 'BIN', 'BIG', 'IPA', 'SENI'],
            ],
            // Class XII-B
            [
                'class_name' => 'XII-B',
                'subject_codes' => ['MTK', 'BIN', 'BIG', 'IPS', 'PJOK'],
            ],
        ];

        foreach ($assignments as $assignment) {
            $class = $classes->firstWhere('name', $assignment['class_name']);
            
            if (!$class) {
                continue;
            }

            foreach ($assignment['subject_codes'] as $subjectCode) {
                $subject = $subjects->firstWhere('code', $subjectCode);
                
                if (!$subject) {
                    continue;
                }

                ClassSubject::updateOrCreate(
                    [
                        'school_class_id' => $class->id,
                        'subject_id' => $subject->id,
                    ],
                    [
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
