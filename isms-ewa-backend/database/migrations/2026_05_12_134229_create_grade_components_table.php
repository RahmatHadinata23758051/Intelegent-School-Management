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
        Schema::create('grade_components', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique()->comment('Unique code for grade component');
            $table->string('name')->comment('Display name of grade component');
            $table->text('description')->nullable()->comment('Description of grade component');
            $table->decimal('default_weight', 5, 2)->nullable()->comment('Default weight percentage (0-100)');
            $table->boolean('is_active')->default(true)->comment('Active status');
            $table->integer('sort_order')->default(0)->comment('Display order');
            $table->timestamps();
            $table->softDeletes();

            $table->index('code');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_components');
    }
};
