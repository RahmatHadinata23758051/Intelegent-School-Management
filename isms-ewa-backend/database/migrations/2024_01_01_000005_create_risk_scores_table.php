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
        Schema::create('risk_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students');
            $table->decimal('total_score', 5, 2);
            $table->decimal('academic_score', 5, 2);
            $table->decimal('behavioral_score', 5, 2);
            $table->string('risk_level', 20);
            $table->timestamp('last_updated');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_scores');
    }
};
