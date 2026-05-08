<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::firstOrCreate(
            ['email' => 'admin@isms-ewa.local'],
            [
                'name' => 'Admin ISMS-EWA',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Teacher user
        User::firstOrCreate(
            ['email' => 'teacher@isms-ewa.local'],
            [
                'name' => 'Guru Matematika',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        // Homeroom teacher user 1
        User::firstOrCreate(
            ['email' => 'homeroom@isms-ewa.local'],
            [
                'name' => 'Wali Kelas X IPA 1',
                'password' => Hash::make('password'),
                'role' => 'homeroom_teacher',
            ]
        );

        // Homeroom teacher user 2
        User::firstOrCreate(
            ['email' => 'homeroom2@isms-ewa.local'],
            [
                'name' => 'Wali Kelas X IPA 2',
                'password' => Hash::make('password'),
                'role' => 'homeroom_teacher',
            ]
        );
    }
}
