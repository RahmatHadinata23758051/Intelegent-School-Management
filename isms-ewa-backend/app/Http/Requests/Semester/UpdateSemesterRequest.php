<?php

namespace App\Http\Requests\Semester;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSemesterRequest extends FormRequest
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
        $semesterId = $this->route('semester')->id;
        $academicYearId = $this->input('academic_year_id') ?? $this->route('semester')->academic_year_id;

        return [
            'academic_year_id' => 'sometimes|exists:academic_years,id',
            'semester_number' => 'sometimes|integer|in:1,2|unique:semesters,semester_number,' . $semesterId . ',id,academic_year_id,' . $academicYearId,
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
            'academic_year_id.exists' => 'Tahun ajaran tidak ditemukan.',
            'semester_number.integer' => 'Nomor semester harus berupa angka.',
            'semester_number.in' => 'Nomor semester harus 1 atau 2.',
            'semester_number.unique' => 'Semester sudah ada untuk tahun ajaran ini.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.date' => 'Format tanggal berakhir tidak valid.',
            'end_date.after' => 'Tanggal berakhir harus setelah tanggal mulai.',
        ];
    }
}
