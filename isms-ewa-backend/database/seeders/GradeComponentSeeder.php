<?php

namespace Database\Seeders;

use App\Models\GradeComponent;
use Illuminate\Database\Seeder;

class GradeComponentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $components = [
            [
                'code' => 'TUGAS',
                'name' => 'Tugas',
                'description' => 'Nilai tugas harian dan pekerjaan rumah',
                'default_weight' => 20.00,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'code' => 'QUIZ',
                'name' => 'Quiz',
                'description' => 'Nilai quiz atau ulangan harian',
                'default_weight' => 15.00,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'code' => 'WEEKLY',
                'name' => 'Weekly Assessment',
                'description' => 'Penilaian mingguan',
                'default_weight' => 25.00,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'code' => 'UTS',
                'name' => 'Ujian Tengah Semester',
                'description' => 'Nilai ujian tengah semester',
                'default_weight' => 20.00,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'code' => 'UAS',
                'name' => 'Ujian Akhir Semester',
                'description' => 'Nilai ujian akhir semester',
                'default_weight' => 20.00,
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($components as $component) {
            GradeComponent::updateOrCreate(
                ['code' => $component['code']],
                $component
            );
        }

        $this->command->info('✅ Grade components seeded successfully');
    }
}
