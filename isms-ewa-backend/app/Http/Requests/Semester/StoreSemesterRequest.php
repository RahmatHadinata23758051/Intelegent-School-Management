<?php

namespace App\Http\Requests\Semester;

use Illuminate\Foundation\Http\FormRequest;

class StoreSemesterRequest extends FormRequest
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
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_number' => 'required|integer|in:1,2|unique:semesters,semester_number,NULL,id,academic_year_id,' . $this->input('academic_year_id'),
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'academic_year_id.required' => 'Tahun ajaran harus diisi.',
            'academic_year_id.exists' => 'Tahun ajaran tidak ditemukan.',
            'semester_number.required' => 'Nomor semester harus diisi.',
            'semester_number.integer' => 'Nomor semester harus berupa angka.',
            'semester_number.in' => 'Nomor semester harus 1 atau 2.',
            'semester_number.unique' => 'Semester sudah ada untuk tahun ajaran ini.',
            'start_date.required' => 'Tanggal mulai harus diisi.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.required' => 'Tanggal berakhir harus diisi.',
            'end_date.date' => 'Format tanggal berakhir tidak valid.',
            'end_date.after' => 'Tanggal berakhir harus setelah tanggal mulai.',
        ];
    }
}
