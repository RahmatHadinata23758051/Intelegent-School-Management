<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'student_id' => fake()->unique()->regexify('[0-9]{5}'),
            'class_id' => fake()->numberBetween(1, 10),
            'risk_score' => fake()->randomFloat(2, 0, 100),
        ];
    }
}
