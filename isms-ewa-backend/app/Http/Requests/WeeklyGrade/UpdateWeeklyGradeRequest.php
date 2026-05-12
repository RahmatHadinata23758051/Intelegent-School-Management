<?php

namespace App\Http\Requests\WeeklyGrade;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWeeklyGradeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'score' => 'required|numeric|min:0|max:100',
            'assessment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'score.required' => 'Nilai wajib diisi',
            'score.min' => 'Nilai minimal 0',
            'score.max' => 'Nilai maksimal 100',
        ];
    }
}
