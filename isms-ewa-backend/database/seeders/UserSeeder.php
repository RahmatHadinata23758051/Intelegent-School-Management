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
                'name' => 'Teacher ISMS-EWA',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        // Homeroom teacher user
        User::firstOrCreate(
            ['email' => 'homeroom@isms-ewa.local'],
            [
                'name' => 'Homeroom Teacher ISMS-EWA',
                'password' => Hash::make('password'),
                'role' => 'homeroom',
            ]
        );
    }
}
