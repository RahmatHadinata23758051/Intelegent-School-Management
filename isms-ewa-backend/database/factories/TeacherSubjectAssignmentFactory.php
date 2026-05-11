<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\ClassSubject;
use App\Models\TeacherProfile;
use App\Models\TeacherSubjectAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherSubjectAssignment>
 */
class TeacherSubjectAssignmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = TeacherSubjectAssignment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'teacher_profile_id' => TeacherProfile::factory()->create()->id,
            'class_subject_id' => ClassSubject::factory()->create()->id,
            'academic_year_id' => AcademicYear::factory()->create(['is_active' => true])->id,
            'is_active' => true,
        ];
    }
}
