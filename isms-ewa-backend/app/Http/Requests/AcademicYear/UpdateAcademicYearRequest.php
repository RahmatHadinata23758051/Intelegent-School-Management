<?php

namespace App\Http\Requests\AcademicYear;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAcademicYearRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'year' => 'sometimes|string|max:10|unique:academic_years,year,' . $this->route('academic_year')->id,
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'year.string' => 'Tahun ajaran harus berupa teks.',
            'year.max' => 'Tahun ajaran maksimal 10 karakter.',
            'year.unique' => 'Tahun ajaran sudah terdaftar.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.date' => 'Format tanggal berakhir tidak valid.',
            'end_date.after' => 'Tanggal berakhir harus setelah tanggal mulai.',
        ];
    }
}
