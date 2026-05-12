<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AcademicYearSemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Academic Year 2025/2026 (current)
        $academicYear = AcademicYear::updateOrCreate(
            ['year' => '2025/2026'],
            [
                'start_date' => Carbon::create(2025, 7, 1),
                'end_date' => Carbon::create(2026, 6, 30),
                'is_active' => true,
            ]
        );

        $this->command->info("Created Academic Year: {$academicYear->year}");

        // Create Semester 1 (Ganjil) - July 2025 to December 2025
        $semester1 = Semester::updateOrCreate(
            [
                'academic_year_id' => $academicYear->id,
                'semester_number' => 1,
            ],
            [
                'start_date' => Carbon::create(2025, 7, 1),
                'end_date' => Carbon::create(2025, 12, 31),
                'is_active' => false,
            ]
        );

        $this->command->info("Created Semester: Semester {$semester1->semester_number}");

        // Create Semester 2 (Genap) - January 2026 to June 2026 (ACTIVE)
        $semester2 = Semester::updateOrCreate(
            [
                'academic_year_id' => $academicYear->id,
                'semester_number' => 2,
            ],
            [
                'start_date' => Carbon::create(2026, 1, 1),
                'end_date' => Carbon::create(2026, 6, 30),
                'is_active' => true, // This is the active semester
            ]
        );

        $this->command->info("Created Semester: Semester {$semester2->semester_number} (ACTIVE)");

        // Create previous Academic Year 2024/2025 (inactive)
        $prevAcademicYear = AcademicYear::updateOrCreate(
            ['year' => '2024/2025'],
            [
                'start_date' => Carbon::create(2024, 7, 1),
                'end_date' => Carbon::create(2025, 6, 30),
                'is_active' => false,
            ]
        );

        $this->command->info("Created Academic Year: {$prevAcademicYear->year}");

        $this->command->info('Academic Year and Semester seeder completed successfully.');
    }
}
