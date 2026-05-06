<?php

namespace App\Constants;

/**
 * User Role Constants
 * 
 * Mendefinisikan role yang valid dalam sistem ISMS-EWA
 */
class UserRole
{
    /**
     * Admin role - Full access ke semua data
     */
    const ADMIN = 'admin';

    /**
     * Teacher role - Akses operasional guru
     */
    const TEACHER = 'teacher';

    /**
     * Homeroom Teacher role - Akses terbatas ke kelas yang dia wali
     */
    const HOMEROOM_TEACHER = 'homeroom_teacher';

    /**
     * Daftar semua role yang valid
     */
    public static function all(): array
    {
        return [
            self::ADMIN,
            self::TEACHER,
            self::HOMEROOM_TEACHER,
        ];
    }

    /**
     * Validasi apakah role valid
     */
    public static function isValid(string $role): bool
    {
        return in_array($role, self::all());
    }

    /**
     * Daftar role dengan deskripsi
     */
    public static function descriptions(): array
    {
        return [
            self::ADMIN => 'Administrator - Full access',
            self::TEACHER => 'Teacher - Operational access',
            self::HOMEROOM_TEACHER => 'Homeroom Teacher - Class-scoped access',
        ];
    }
}
