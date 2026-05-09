<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== TESTING LOGIN CREDENTIALS ===\n\n";

$testCredentials = [
    ['email' => 'admin@isms-ewa.local', 'password' => 'password'],
    ['email' => 'teacher@isms-ewa.local', 'password' => 'password'],
    ['email' => 'homeroom@isms-ewa.local', 'password' => 'password'],
];

foreach ($testCredentials as $cred) {
    echo "Testing: {$cred['email']}\n";
    
    $user = User::where('email', $cred['email'])->first();
    
    if (!$user) {
        echo "  ❌ User NOT FOUND in database\n";
        echo "\n";
        continue;
    }
    
    echo "  ✅ User found\n";
    echo "  Name: {$user->name}\n";
    echo "  Role: {$user->role}\n";
    echo "  Password hash: " . substr($user->password, 0, 20) . "...\n";
    
    $passwordMatch = Hash::check($cred['password'], $user->password);
    echo "  Password match: " . ($passwordMatch ? '✅ YES' : '❌ NO') . "\n";
    
    if (!$passwordMatch) {
        echo "  Trying to hash the password again: " . Hash::make($cred['password']) . "\n";
    }
    
    echo "\n";
}

echo "=== DATABASE SUMMARY ===\n";
echo "Total users: " . User::count() . "\n";
echo "Users:\n";
User::all()->each(function ($user) {
    echo "  - {$user->email} ({$user->role})\n";
});
