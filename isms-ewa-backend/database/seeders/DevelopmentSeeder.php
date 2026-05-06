<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;
use App\Services\ScoringService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevelopmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@isms-ewa.local'],
            [
                'name' => 'Admin ISMS-EWA',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Create teacher user
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@isms-ewa.local'],
            [
                'name' => 'Guru Matematika',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        // Create homeroom teacher user
        $homeroomTeacher = User::firstOrCreate(
            ['email' => 'homeroom@isms-ewa.local'],
            [
                'name' => 'Wali Kelas X IPA 1',
                'password' => Hash::make('password'),
                'role' => 'homeroom_teacher',
            ]
        );

        // Create school classes
        $class1 = SchoolClass::firstOrCreate(
            ['name' => 'X IPA 1'],
            [
                'grade_level' => 'X',
                'homeroom_teacher_id' => $homeroomTeacher->id,
            ]
        );

        $class2 = SchoolClass::firstOrCreate(
            ['name' => 'X IPA 2'],
            [
                'grade_level' => 'X',
                'homeroom_teacher_id' => $homeroomTeacher->id,
            ]
        );

        // Create students for class 1
        // Student 1: SAFE - High grades, no violations
        $student1 = Student::firstOrCreate(
            ['student_id' => 'STU001'],
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@student.local',
                'school_class_id' => $class1->id,
                'gender' => 'male',
                'birth_date' => '2008-05-15',
                'address' => 'Jl. Merdeka No. 123',
            ]
        );

        // Student 2: SAFE - Very high grades, no violations
        $student2 = Student::firstOrCreate(
            ['student_id' => 'STU002'],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@student.local',
                'school_class_id' => $class1->id,
                'gender' => 'female',
                'birth_date' => '2008-08-22',
                'address' => 'Jl. Sudirman No. 456',
            ]
        );

        // Student 3: HIGH_RISK - Low grades, multiple violations
        $student3 = Student::firstOrCreate(
            ['student_id' => 'STU003'],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@student.local',
                'school_class_id' => $class1->id,
                'gender' => 'male',
                'birth_date' => '2008-03-10',
                'address' => 'Jl. Gatot Subroto No. 789',
            ]
        );

        // Create students for class 2
        // Student 4: WARNING - Medium grades, minor violations
        $student4 = Student::firstOrCreate(
            ['student_id' => 'STU004'],
            [
                'name' => 'Rina Wijaya',
                'email' => 'rina.wijaya@student.local',
                'school_class_id' => $class2->id,
                'gender' => 'female',
                'birth_date' => '2008-07-18',
                'address' => 'Jl. Ahmad Yani No. 321',
            ]
        );

        // Student 5: HIGH_RISK - Low grades, severe violation
        $student5 = Student::firstOrCreate(
            ['student_id' => 'STU005'],
            [
                'name' => 'Doni Hermawan',
                'email' => 'doni.hermawan@student.local',
                'school_class_id' => $class2->id,
                'gender' => 'male',
                'birth_date' => '2008-11-25',
                'address' => 'Jl. Diponegoro No. 654',
            ]
        );

        // Create grades for students
        // Student 1: Average 86.75 (SAFE)
        Grade::firstOrCreate(
            ['student_id' => $student1->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 85.5]
        );

        Grade::firstOrCreate(
            ['student_id' => $student1->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 88.0]
        );

        // Student 2: Average 91.25 (SAFE)
        Grade::firstOrCreate(
            ['student_id' => $student2->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 92.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student2->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 90.5]
        );

        // Student 3: Average 50 (HIGH_RISK)
        Grade::firstOrCreate(
            ['student_id' => $student3->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 45.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student3->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 55.0]
        );

        // Student 4: Average 75 (WARNING)
        Grade::firstOrCreate(
            ['student_id' => $student4->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 75.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student4->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 75.0]
        );

        // Student 5: Average 50 (HIGH_RISK)
        Grade::firstOrCreate(
            ['student_id' => $student5->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 50.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student5->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 50.0]
        );

        // Create violations for students
        // Student 1: 1 minor violation (SAFE)
        Violation::firstOrCreate(
            ['student_id' => $student1->id, 'description' => 'Terlambat masuk kelas', 'reported_date' => '2024-01-15'],
            [
                'severity' => 'minor',
                'reported_by' => $teacher->id,
            ]
        );

        // Student 3: Multiple violations (HIGH_RISK)
        Violation::firstOrCreate(
            ['student_id' => $student3->id, 'description' => 'Tidak mengerjakan PR', 'reported_date' => '2024-01-18'],
            [
                'severity' => 'moderate',
                'reported_by' => $teacher->id,
            ]
        );

        Violation::firstOrCreate(
            ['student_id' => $student3->id, 'description' => 'Bolos sekolah', 'reported_date' => '2024-01-20'],
            [
                'severity' => 'major',
                'reported_by' => $homeroomTeacher->id,
            ]
        );

        // Student 4: 1 minor violation (WARNING)
        Violation::firstOrCreate(
            ['student_id' => $student4->id, 'description' => 'Terlambat masuk kelas', 'reported_date' => '2024-01-19'],
            [
                'severity' => 'minor',
                'reported_by' => $teacher->id,
            ]
        );

        // Student 5: 1 severe violation (HIGH_RISK)
        Violation::firstOrCreate(
            ['student_id' => $student5->id, 'description' => 'Menyontek saat ujian', 'reported_date' => '2024-01-22'],
            [
                'severity' => 'severe',
                'reported_by' => $teacher->id,
            ]
        );

        // Calculate risk scores for all students
        $scoringService = app(ScoringService::class);
        foreach (Student::all() as $student) {
            $scoringService->updateStudentRiskScore($student);
        }
    }
}
