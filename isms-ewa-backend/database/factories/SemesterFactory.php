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

        // Check which semester numbers are already used for this academic year
        $existingSemesters = \App\Models\Semester::where('academic_year_id', $academicYear->id)
            ->pluck('semester_number')
            ->toArray();
        
        // Determine available semester numbers
        $availableNumbers = array_diff([1, 2], $existingSemesters);
        
        // If no numbers available, create new academic year
        if (empty($availableNumbers)) {
            $academicYear = \App\Models\AcademicYear::factory()->create();
            $startDate = fake()->dateTimeBetween($academicYear->start_date, $academicYear->end_date);
            $endDate = fake()->dateTimeBetween($startDate, $academicYear->end_date);
            $semesterNumber = 1; // Start with 1 for new academic year
        } else {
            $semesterNumber = reset($availableNumbers); // Get first available number
        }

        return [
            'academic_year_id' => $academicYear->id,
            'semester_number' => $semesterNumber,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_active' => false,
        ];
    }

    /**
     * State for semester 1
     */
    public function semesterOne()
    {
        return $this->state(function (array $attributes) {
            return [
                'semester_number' => 1,
            ];
        });
    }

    /**
     * State for semester 2
     */
    public function semesterTwo()
    {
        return $this->state(function (array $attributes) {
            return [
                'semester_number' => 2,
            ];
        });
    }
}
