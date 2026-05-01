<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                  ->unique()
                  ->constrained('students')
                  ->onDelete('cascade');
            $table->float('total_score')->default(0);
            $table->float('academic_score')->default(0);
            $table->float('behavioral_score')->default(0);
            $table->string('risk_level')->default('low');
            $table->timestamp('last_updated')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_scores');
    }
};
