<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->bothify('???'),
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'credit_hours' => $this->faker->numberBetween(1, 4),
            'is_active' => true,
        ];
    }
}
