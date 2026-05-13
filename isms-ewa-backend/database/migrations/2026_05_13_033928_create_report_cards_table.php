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
        Schema::create('report_cards', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('school_class_id')->constrained('school_classes')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            $table->foreignId('student_academic_summary_id')->nullable()->constrained('student_academic_summaries')->onDelete('set null');
            
            // Report metadata
            $table->string('report_number')->nullable()->unique();
            $table->string('status')->default('draft')->comment('draft, generated, reviewed, approved');
            
            // Snapshot data (JSON for historical preservation)
            $table->json('subject_grades')->nullable()->comment('Snapshot of all subject grades');
            $table->json('attendance_summary')->nullable()->comment('Snapshot of attendance data');
            $table->json('violation_summary')->nullable()->comment('Snapshot of violation data');
            $table->json('academic_summary')->nullable()->comment('Snapshot of academic metrics');
            
            // Notes
            $table->text('notes')->nullable()->comment('General notes');
            $table->text('homeroom_notes')->nullable()->comment('Homeroom teacher notes');
            
            // Workflow timestamps
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            
            // Workflow users
            $table->foreignId('generated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Unique constraint: one report card per student per semester
            $table->unique(['student_id', 'academic_year_id', 'semester_id'], 'unique_student_semester_report');
            
            // Indexes for common queries
            $table->index(['academic_year_id', 'semester_id']);
            $table->index(['school_class_id', 'academic_year_id', 'semester_id']);
            $table->index('status');
            $table->index('report_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_cards');
    }
};
