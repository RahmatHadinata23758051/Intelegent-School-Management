<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test mass assignment hanya mengisi kolom yang ada di $fillable
     */
    public function test_mass_assignment_only_fillable_columns()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'id' => 999, // Ini tidak boleh tersimpan karena tidak di $fillable
        ]);

        $this->assertNotEquals(999, $user->id);
        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('test@example.com', $user->email);
        $this->assertEquals('admin', $user->role);
    }

    /**
     * Test field password tidak muncul saat model di-serialize ke JSON
     */
    public function test_password_hidden_in_json_serialization()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $json = $user->toJson();
        $this->assertStringNotContainsString('password', $json);
    }

    /**
     * Test field remember_token tidak muncul saat model di-serialize ke JSON
     */
    public function test_remember_token_hidden_in_json_serialization()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $json = $user->toJson();
        $this->assertStringNotContainsString('remember_token', $json);
    }

    /**
     * Test password tersimpan dalam bentuk hash
     */
    public function test_password_stored_as_hash()
    {
        $plainPassword = 'password123';
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt($plainPassword),
            'role' => 'admin',
        ]);

        $this->assertNotEquals($plainPassword, $user->password);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check($plainPassword, $user->password));
    }
}
