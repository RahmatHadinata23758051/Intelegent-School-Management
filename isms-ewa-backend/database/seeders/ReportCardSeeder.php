<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\User;
use App\Services\ReportCardService;
use Illuminate\Database\Seeder;

class ReportCardSeeder extends Seeder
{
    protected $reportCardService;
    
    public function __construct(ReportCardService $reportCardService)
    {
        $this->reportCardService = $reportCardService;
    }
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Generating report cards...');
        
        // Get active academic year and semester
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();
        
        if (!$academicYear || !$semester) {
            $this->command->warn('No active academic year or semester found. Skipping report card seeding.');
            return;
        }
        
        // Get admin user as generator
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->warn('No admin user found. Skipping report card seeding.');
            return;
        }
        
        // Get all students
        $students = Student::with('schoolClass')->get();
        
        if ($students->isEmpty()) {
            $this->command->warn('No students found. Skipping report card seeding.');
            return;
        }
        
        $this->command->info("Generating report cards for {$students->count()} students...");
        
        $progressBar = $this->command->getOutput()->createProgressBar($students->count());
        $progressBar->start();
        
        foreach ($students as $student) {
            try {
                $this->reportCardService->generateReportCard(
                    $student,
                    $academicYear,
                    $semester,
                    $admin->id
                );
                $progressBar->advance();
            } catch (\Exception $e) {
                $this->command->error("\nError generating report card for student {$student->name}: {$e->getMessage()}");
            }
        }
        
        $progressBar->finish();
        $this->command->newLine();
        $this->command->info('Report cards generated successfully!');
    }
}
