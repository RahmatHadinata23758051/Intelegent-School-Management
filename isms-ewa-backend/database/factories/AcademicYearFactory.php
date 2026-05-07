<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-2 years', 'now');
        $endDate = fake()->dateTimeBetween($startDate, '+1 year');

        return [
            'year' => fake()->unique()->numerify('####/####'),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_active' => false,
        ];
    }
}
