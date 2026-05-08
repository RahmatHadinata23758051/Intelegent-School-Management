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
        User::updateOrCreate(
            ['email' => 'admin@isms-ewa.local'],
            [
                'name' => 'Admin ISMS-EWA',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Teacher user
        User::updateOrCreate(
            ['email' => 'teacher@isms-ewa.local'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        // Homeroom teacher user 1
        User::updateOrCreate(
            ['email' => 'homeroom@isms-ewa.local'],
            [
                'name' => 'Siti Nurhaliza',
                'password' => Hash::make('password'),
                'role' => 'homeroom_teacher',
            ]
        );

        // Homeroom teacher user 2
        User::updateOrCreate(
            ['email' => 'homeroom2@isms-ewa.local'],
            [
                'name' => 'Ahmad Wijaya',
                'password' => Hash::make('password'),
                'role' => 'homeroom_teacher',
            ]
        );
    }
}
