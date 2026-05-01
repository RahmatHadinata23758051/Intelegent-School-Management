<?php

namespace Database\Factories;

use App\Models\Grade;
use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    protected $model = Grade::class;

    public function definition(): array
    {
        return [
            'student_id' => fake()->numberBetween(1, 50),
            'subject' => fake()->randomElement(['Math', 'English', 'Science', 'History', 'Physical Education']),
            'score' => fake()->randomFloat(2, 0, 100),
            'semester' => fake()->randomElement(['1', '2']),
            'academic_year' => fake()->year(),
        ];
    }
}
