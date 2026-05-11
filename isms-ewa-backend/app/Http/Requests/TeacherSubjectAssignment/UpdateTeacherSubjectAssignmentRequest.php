<?php

namespace App\Http\Requests\TeacherSubjectAssignment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherSubjectAssignmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'is_active.boolean' => 'Status harus berupa boolean',
        ];
    }
}
