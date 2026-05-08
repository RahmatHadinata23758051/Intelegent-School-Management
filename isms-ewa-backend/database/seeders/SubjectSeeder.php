<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            [
                'code' => 'MTK',
                'name' => 'Matematika',
                'description' => 'Mata pelajaran matematika',
                'credit_hours' => 4,
                'is_active' => true,
            ],
            [
                'code' => 'BIN',
                'name' => 'Bahasa Indonesia',
                'description' => 'Mata pelajaran bahasa Indonesia',
                'credit_hours' => 4,
                'is_active' => true,
            ],
            [
                'code' => 'BIG',
                'name' => 'Bahasa Inggris',
                'description' => 'Mata pelajaran bahasa Inggris',
                'credit_hours' => 3,
                'is_active' => true,
            ],
            [
                'code' => 'IPA',
                'name' => 'Ilmu Pengetahuan Alam',
                'description' => 'Mata pelajaran IPA',
                'credit_hours' => 4,
                'is_active' => true,
            ],
            [
                'code' => 'IPS',
                'name' => 'Ilmu Pengetahuan Sosial',
                'description' => 'Mata pelajaran IPS',
                'credit_hours' => 3,
                'is_active' => true,
            ],
            [
                'code' => 'PKN',
                'name' => 'Pendidikan Pancasila dan Kewarganegaraan',
                'description' => 'Mata pelajaran PKN',
                'credit_hours' => 2,
                'is_active' => true,
            ],
            [
                'code' => 'PJOK',
                'name' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
                'description' => 'Mata pelajaran PJOK',
                'credit_hours' => 2,
                'is_active' => true,
            ],
            [
                'code' => 'SENI',
                'name' => 'Seni Budaya',
                'description' => 'Mata pelajaran seni budaya',
                'credit_hours' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::updateOrCreate(
                ['code' => $subject['code']],
                $subject
            );
        }
    }
}
