<?php

namespace Database\Factories;

use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherProfile>
 */
class TeacherProfileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = TeacherProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->create(['role' => 'teacher'])->id,
            'nip' => $this->faker->unique()->numerify('##########'),
            'qualification' => $this->faker->randomElement(['S1', 'S2', 'S3']),
            'specialization' => $this->faker->word(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'employment_status' => $this->faker->randomElement(['permanent', 'contract']),
            'joined_date' => $this->faker->date(),
            'is_active' => true,
        ];
    }
}
