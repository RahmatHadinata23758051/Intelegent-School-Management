<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\User;
use App\Services\AcademicRecapService;
use Illuminate\Database\Seeder;

class AcademicSummarySeeder extends Seeder
{
    protected $academicRecapService;
    
    public function __construct(AcademicRecapService $academicRecapService)
    {
        $this->academicRecapService = $academicRecapService;
    }
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Generating academic summaries...');
        
        // Get active academic year and semester
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();
        
        if (!$academicYear || !$semester) {
            $this->command->warn('No active academic year or semester found. Skipping academic summary seeding.');
            return;
        }
        
        // Get admin user as generator
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->warn('No admin user found. Skipping academic summary seeding.');
            return;
        }
        
        // Get all students
        $students = Student::with('schoolClass')->get();
        
        if ($students->isEmpty()) {
            $this->command->warn('No students found. Skipping academic summary seeding.');
            return;
        }
        
        $this->command->info("Generating summaries for {$students->count()} students...");
        
        $progressBar = $this->command->getOutput()->createProgressBar($students->count());
        $progressBar->start();
        
        foreach ($students as $student) {
            try {
                $this->academicRecapService->generateStudentSummary(
                    $student,
                    $academicYear,
                    $semester,
                    $admin->id
                );
                $progressBar->advance();
            } catch (\Exception $e) {
                $this->command->error("\nError generating summary for student {$student->name}: {$e->getMessage()}");
            }
        }
        
        $progressBar->finish();
        $this->command->newLine();
        $this->command->info('Academic summaries generated successfully!');
    }
}
