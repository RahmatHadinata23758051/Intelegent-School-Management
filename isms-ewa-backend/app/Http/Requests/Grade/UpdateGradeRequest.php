<?php

namespace App\Http\Requests\Grade;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'subject' => 'sometimes|required|string|max:255',
            'score' => 'sometimes|required|numeric|min:0|max:100',
            'semester' => 'sometimes|required|string|max:10',
            'academic_year' => 'sometimes|required|string|max:20',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'subject.required' => 'Mata pelajaran harus diisi.',
            'subject.string' => 'Mata pelajaran harus berupa teks.',
            'subject.max' => 'Mata pelajaran maksimal 255 karakter.',
            'score.required' => 'Nilai harus diisi.',
            'score.numeric' => 'Nilai harus berupa angka.',
            'score.min' => 'Nilai minimal 0.',
            'score.max' => 'Nilai maksimal 100.',
            'semester.required' => 'Semester harus diisi.',
            'semester.string' => 'Semester harus berupa teks.',
            'semester.max' => 'Semester maksimal 10 karakter.',
            'academic_year.required' => 'Tahun akademik harus diisi.',
            'academic_year.string' => 'Tahun akademik harus berupa teks.',
            'academic_year.max' => 'Tahun akademik maksimal 20 karakter.',
        ];
    }
}
