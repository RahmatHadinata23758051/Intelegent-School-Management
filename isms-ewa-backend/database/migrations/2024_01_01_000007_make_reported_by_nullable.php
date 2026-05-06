<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For PostgreSQL and other databases, use Schema builder
        Schema::table('violations', function (Blueprint $table) {
            // Make reported_by nullable if it's not already
            $table->unsignedBigInteger('reported_by')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse is complex for SQLite, so we'll skip it
    }
};
