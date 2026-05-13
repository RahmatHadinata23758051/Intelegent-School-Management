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
        Schema::create('student_academic_summaries', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('school_class_id')->constrained('school_classes')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            
            // Academic metrics
            $table->integer('total_subjects')->default(0);
            $table->decimal('average_score', 5, 2)->nullable();
            $table->decimal('min_score', 5, 2)->nullable();
            $table->decimal('max_score', 5, 2)->nullable();
            $table->integer('low_score_count')->default(0)->comment('Count of scores below 70');
            
            // Attendance metrics
            $table->decimal('attendance_rate', 5, 2)->nullable();
            $table->integer('present_count')->default(0);
            $table->integer('sick_count')->default(0);
            $table->integer('permitted_count')->default(0);
            $table->integer('absent_count')->default(0);
            $table->integer('late_count')->default(0);
            
            // Violation metrics
            $table->integer('violation_count')->default(0);
            $table->integer('minor_violation_count')->default(0);
            $table->integer('moderate_violation_count')->default(0);
            $table->integer('major_violation_count')->default(0);
            $table->integer('severe_violation_count')->default(0);
            
            // Status indicators
            $table->string('academic_status')->nullable()->comment('excellent, good, fair, poor, critical');
            $table->string('attendance_status')->nullable()->comment('excellent, good, warning, poor');
            $table->string('behavior_status')->nullable()->comment('clean, minor_issue, warning, serious');
            $table->string('overall_status')->nullable()->comment('excellent, good, warning, critical');
            
            // Generation metadata
            $table->timestamp('generated_at')->nullable();
            $table->foreignId('generated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Unique constraint: one summary per student per semester
            $table->unique(['student_id', 'academic_year_id', 'semester_id'], 'unique_student_semester_summary');
            
            // Indexes for common queries
            $table->index(['academic_year_id', 'semester_id']);
            $table->index(['school_class_id', 'academic_year_id', 'semester_id']);
            $table->index('academic_status');
            $table->index('overall_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_academic_summaries');
    }
};
