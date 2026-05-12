<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weekly_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('teacher_subject_assignment_id')->constrained('teacher_subject_assignments')->onDelete('cascade');
            $table->foreignId('grade_component_id')->constrained('grade_components')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            $table->integer('week_number')->comment('Week number (1-52)');
            $table->date('assessment_date')->nullable()->comment('Date of assessment');
            $table->decimal('score', 5, 2)->comment('Score (0-100)');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Unique constraint: one grade per student per assignment per component per week
            $table->unique([
                'student_id',
                'teacher_subject_assignment_id',
                'grade_component_id',
                'academic_year_id',
                'semester_id',
                'week_number'
            ], 'weekly_grade_unique');

            // Indexes for common queries
            $table->index('student_id');
            $table->index('teacher_subject_assignment_id');
            $table->index('grade_component_id');
            $table->index('academic_year_id');
            $table->index('semester_id');
            $table->index('week_number');
            $table->index('assessment_date');
            $table->index('score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weekly_grades');
    }
};
