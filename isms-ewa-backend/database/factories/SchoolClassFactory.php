<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grades = ['X', 'XI', 'XII'];
        $letters = ['A', 'B', 'C'];

        return [
            'name' => $this->faker->randomElement($grades) . '-' . $this->faker->randomElement($letters),
            'grade_level' => $this->faker->randomElement([10, 11, 12]),
            'homeroom_teacher_id' => null,
        ];
    }
}
