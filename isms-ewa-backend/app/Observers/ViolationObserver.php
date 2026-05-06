<?php

namespace App\Observers;

use App\Models\Violation;
use App\Services\ScoringService;

class ViolationObserver
{
    protected $scoringService;

    public function __construct(ScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    /**
     * Handle the Violation "created" event.
     */
    public function created(Violation $violation): void
    {
        $this->scoringService->updateStudentRiskScore($violation->student);
    }

    /**
     * Handle the Violation "updated" event.
     */
    public function updated(Violation $violation): void
    {
        $this->scoringService->updateStudentRiskScore($violation->student);
    }

    /**
     * Handle the Violation "deleted" event.
     */
    public function deleted(Violation $violation): void
    {
        $this->scoringService->updateStudentRiskScore($violation->student);
    }
}
