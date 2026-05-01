<?php

namespace App\Exceptions;

use Exception;

class StudentNotFoundException extends Exception
{
    public function __construct($id = null)
    {
        parent::__construct($id ? "Student with ID {$id} not found" : 'Student not found');
    }
}
