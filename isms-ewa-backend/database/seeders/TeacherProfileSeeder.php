<?php

namespace Database\Seeders;

use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Teacher profile untuk teacher@isms-ewa.local
        $teacher = User::where('email', 'teacher@isms-ewa.local')->first();
        if ($teacher) {
            TeacherProfile::updateOrCreate(
                ['user_id' => $teacher->id],
                [
                    'nip' => '198501151234567',
                    'qualification' => 'S1 Pendidikan Matematika',
                    'specialization' => 'Matematika',
                    'phone' => '081234567890',
                    'address' => 'Jl. Merdeka No. 123, Jakarta',
                    'employment_status' => 'permanent',
                    'joined_date' => '2020-01-15',
                    'is_active' => true,
                ]
            );
        }

        // Teacher profile untuk homeroom@isms-ewa.local
        $homeroom1 = User::where('email', 'homeroom@isms-ewa.local')->first();
        if ($homeroom1) {
            TeacherProfile::updateOrCreate(
                ['user_id' => $homeroom1->id],
                [
                    'nip' => '198602201234568',
                    'qualification' => 'S1 Pendidikan Bahasa Indonesia',
                    'specialization' => 'Bahasa Indonesia',
                    'phone' => '081234567891',
                    'address' => 'Jl. Sudirman No. 456, Jakarta',
                    'employment_status' => 'permanent',
                    'joined_date' => '2019-08-20',
                    'is_active' => true,
                ]
            );
        }

        // Teacher profile untuk homeroom2@isms-ewa.local
        $homeroom2 = User::where('email', 'homeroom2@isms-ewa.local')->first();
        if ($homeroom2) {
            TeacherProfile::updateOrCreate(
                ['user_id' => $homeroom2->id],
                [
                    'nip' => '198703101234569',
                    'qualification' => 'S1 Pendidikan Fisika',
                    'specialization' => 'Fisika',
                    'phone' => '081234567892',
                    'address' => 'Jl. Gatot Subroto No. 789, Jakarta',
                    'employment_status' => 'permanent',
                    'joined_date' => '2021-03-10',
                    'is_active' => true,
                ]
            );
        }
    }
}
