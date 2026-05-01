<?php

namespace App\Events;

use App\Models\Violation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ViolationUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(public Violation $violation)
    {
    }
}
