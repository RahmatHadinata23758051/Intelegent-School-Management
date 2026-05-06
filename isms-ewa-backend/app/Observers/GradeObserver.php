<?php

namespace App\Observers;

use App\Models\Grade;
use App\Services\ScoringService;

class GradeObserver
{
    protected $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    /**
     * Handle the Grade "created" event.
     */
    public function created(Grade $grade): void
    {
        $this->scoringService->updateStudentRiskScore($grade->student);
    }

    /**
     * Handle the Grade "updated" event.
     */
    public function updated(Grade $grade): void
    {
        $this->scoringService->updateStudentRiskScore($grade->student);
    }

    /**
     * Handle the Grade "deleted" event.
     */
    public function deleted(Grade $grade): void
    {
        $this->scoringService->updateStudentRiskScore($grade->student);
    }
}
