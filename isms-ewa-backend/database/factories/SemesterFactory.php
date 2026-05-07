<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Semester>
 */
class SemesterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $academicYear = \App\Models\AcademicYear::factory()->create();
        $startDate = fake()->dateTimeBetween($academicYear->start_date, $academicYear->end_date);
        $endDate = fake()->dateTimeBetween($startDate, $academicYear->end_date);

        return [
            'academic_year_id' => $academicYear->id,
            'semester_number' => fake()->randomElement([1, 2]),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_active' => false,
        ];
    }
}
