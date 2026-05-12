<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get active academic year and semester
        $academicYear = AcademicYear::where('is_active', true)->first();
        $semester = Semester::where('is_active', true)->first();

        if (!$academicYear || !$semester) {
            $this->command->warn('No active academic year or semester found. Skipping attendance seeder.');
            return;
        }

        // Get admin user as creator
        $admin = User::where('role', 'admin')->first();

        // Get classes
        $classes = SchoolClass::all();

        if ($classes->isEmpty()) {
            $this->command->warn('No classes found. Skipping attendance seeder.');
            return;
        }

        // Use semester date range for attendance
        $semesterStart = Carbon::parse($semester->start_date);
        $semesterEnd = Carbon::parse($semester->end_date);
        $today = Carbon::now();

        // Create attendance sessions for dates within semester
        // Use the last 10 weekdays within the semester range
        $endDate = $today->lt($semesterEnd) ? $today : $semesterEnd;
        $startDate = $endDate->copy()->subDays(15); // Go back 15 days to get ~10 weekdays

        // Make sure start date is not before semester start
        if ($startDate->lt($semesterStart)) {
            $startDate = $semesterStart->copy();
        }

        foreach ($classes as $class) {
            $students = Student::where('school_class_id', $class->id)->get();

            if ($students->isEmpty()) {
                continue;
            }

            $sessionCount = 0;

            // Create sessions for each day
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                // Create attendance session
                $session = AttendanceSession::updateOrCreate(
                    [
                        'school_class_id' => $class->id,
                        'session_date' => $date->format('Y-m-d'),
                        'session_type' => 'daily',
                    ],
                    [
                        'academic_year_id' => $academicYear->id,
                        'semester_id' => $semester->id,
                        'notes' => 'Absensi harian ' . $date->format('d M Y'),
                        'created_by' => $admin->id,
                        'is_locked' => $date->lt(Carbon::now()->subDays(3)), // Lock sessions older than 3 days
                    ]
                );

                // Create attendance records for each student
                foreach ($students as $student) {
                    // Randomize attendance status with realistic distribution
                    $rand = rand(1, 100);
                    if ($rand <= 85) {
                        $status = 'present'; // 85% present
                    } elseif ($rand <= 90) {
                        $status = 'late'; // 5% late
                    } elseif ($rand <= 95) {
                        $status = 'sick'; // 5% sick
                    } elseif ($rand <= 98) {
                        $status = 'permitted'; // 3% permitted
                    } else {
                        $status = 'absent'; // 2% absent
                    }

                    Attendance::updateOrCreate(
                        [
                            'attendance_session_id' => $session->id,
                            'student_id' => $student->id,
                        ],
                        [
                            'status' => $status,
                            'notes' => $status === 'sick' ? 'Sakit' : ($status === 'permitted' ? 'Izin' : null),
                            'recorded_by' => $admin->id,
                            'recorded_at' => $date->copy()->setTime(7, 30),
                        ]
                    );
                }

                $sessionCount++;
            }

            $this->command->info("Created {$sessionCount} attendance sessions for {$class->name}");
        }

        $this->command->info('Attendance seeder completed successfully.');
    }
}
