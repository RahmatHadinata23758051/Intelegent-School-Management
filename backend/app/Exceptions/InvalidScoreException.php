<?php

namespace App\Exceptions;

use Exception;

class InvalidScoreException extends Exception
{
    public function __construct($score)
    {
        parent::__construct("Invalid score: {$score}. Score must be between 0 and 100.");
    }
}
