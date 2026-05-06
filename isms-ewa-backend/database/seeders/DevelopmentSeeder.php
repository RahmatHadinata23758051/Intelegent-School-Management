<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Models\Violation;
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
        Grade::firstOrCreate(
            ['student_id' => $student1->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 85.5]
        );

        Grade::firstOrCreate(
            ['student_id' => $student1->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 88.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student2->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 92.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student2->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 90.5]
        );

        Grade::firstOrCreate(
            ['student_id' => $student3->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 75.0]
        );

        Grade::firstOrCreate(
            ['student_id' => $student4->id, 'subject' => 'Matematika', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 88.5]
        );

        Grade::firstOrCreate(
            ['student_id' => $student5->id, 'subject' => 'Bahasa Indonesia', 'semester' => '1', 'academic_year' => '2024/2025'],
            ['score' => 82.0]
        );

        // Create violations for students
        Violation::firstOrCreate(
            ['student_id' => $student1->id, 'description' => 'Terlambat masuk kelas', 'reported_date' => '2024-01-15'],
            [
                'severity' => 'minor',
                'reported_by' => $teacher->id,
            ]
        );

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

        Violation::firstOrCreate(
            ['student_id' => $student5->id, 'description' => 'Menyontek saat ujian', 'reported_date' => '2024-01-22'],
            [
                'severity' => 'severe',
                'reported_by' => $teacher->id,
            ]
        );
    }
}
