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
        // For SQLite, we need to recreate the table
        if (Schema::hasTable('violations')) {
            DB::statement('PRAGMA foreign_keys=OFF');
            
            DB::statement('
                CREATE TABLE violations_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id BIGINT UNSIGNED NOT NULL,
                    description TEXT NOT NULL,
                    severity VARCHAR(20) NOT NULL,
                    reported_by BIGINT UNSIGNED NULLABLE,
                    reported_date DATE NOT NULL,
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    FOREIGN KEY (student_id) REFERENCES students(id),
                    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL
                )
            ');
            
            DB::statement('
                INSERT INTO violations_new (id, student_id, description, severity, reported_by, reported_date, created_at, updated_at)
                SELECT id, student_id, description, severity, reported_by, reported_date, created_at, updated_at FROM violations
            ');
            
            DB::statement('DROP TABLE violations');
            DB::statement('ALTER TABLE violations_new RENAME TO violations');
            
            DB::statement('PRAGMA foreign_keys=ON');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse is complex for SQLite, so we'll skip it
    }
};
