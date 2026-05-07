<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Semester;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service untuk mengelola tahun ajaran dan semester
 */
class AcademicPeriodService
{
    /**
     * Activate academic year dan deactivate yang lain
     * Hanya satu tahun ajaran yang bisa active pada satu waktu
     *
     * @param AcademicYear $academicYear
     * @return AcademicYear
     */
    public function activateAcademicYear(AcademicYear $academicYear): AcademicYear
    {
        // Deactivate semua tahun ajaran lain
        AcademicYear::where('id', '!=', $academicYear->id)
            ->update(['is_active' => false]);

        // Activate tahun ajaran ini
        $academicYear->update(['is_active' => true]);

        return $academicYear;
    }

    /**
     * Activate semester dan deactivate yang lain dalam tahun ajaran yang sama
     * Hanya satu semester yang bisa active pada satu waktu
     *
     * @param Semester $semester
     * @return Semester
     */
    public function activateSemester(Semester $semester): Semester
    {
        // Deactivate semua semester lain dalam tahun ajaran yang sama
        Semester::where('academic_year_id', $semester->academic_year_id)
            ->where('id', '!=', $semester->id)
            ->update(['is_active' => false]);

        // Activate semester ini
        $semester->update(['is_active' => true]);

        // Auto-activate parent academic year jika belum active
        if (!$semester->academicYear->is_active) {
            $this->activateAcademicYear($semester->academicYear);
        }

        return $semester;
    }

    /**
     * Get active academic year
     *
     * @return AcademicYear|null
     */
    public function getActiveAcademicYear(): ?AcademicYear
    {
        return AcademicYear::where('is_active', true)->first();
    }

    /**
     * Get active semester
     *
     * @return Semester|null
     */
    public function getActiveSemester(): ?Semester
    {
        return Semester::where('is_active', true)->first();
    }

    /**
     * Get active semester dengan academic year
     *
     * @return Semester|null
     */
    public function getActiveSemesterWithYear(): ?Semester
    {
        return Semester::where('is_active', true)
            ->with('academicYear')
            ->first();
    }

    /**
     * Check apakah academic year bisa didelete
     * Tidak bisa delete jika sedang active
     *
     * @param AcademicYear $academicYear
     * @return bool
     */
    public function canDeleteAcademicYear(AcademicYear $academicYear): bool
    {
        return !$academicYear->is_active;
    }

    /**
     * Check apakah semester bisa didelete
     * Tidak bisa delete jika sedang active
     *
     * @param Semester $semester
     * @return bool
     */
    public function canDeleteSemester(Semester $semester): bool
    {
        return !$semester->is_active;
    }

    /**
     * Get semesters untuk academic year tertentu
     *
     * @param AcademicYear $academicYear
     * @return Collection
     */
    public function getSemestersByAcademicYear(AcademicYear $academicYear): Collection
    {
        return $academicYear->semesters()->orderBy('semester_number')->get();
    }
}
