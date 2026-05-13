<?php

namespace App\Http\Requests\AcademicRecap;

use Illuminate\Foundation\Http\FormRequest;

class GenerateAcademicSummaryRequest extends FormRequest
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
            'student_id' => 'nullable|exists:students,id|required_without:school_class_id',
            'school_class_id' => 'nullable|exists:school_classes,id|required_without:student_id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'student_id.exists' => 'Siswa tidak ditemukan',
            'student_id.required_without' => 'Student ID atau Class ID harus diisi',
            'school_class_id.exists' => 'Kelas tidak ditemukan',
            'school_class_id.required_without' => 'Student ID atau Class ID harus diisi',
            'academic_year_id.required' => 'Tahun ajaran harus diisi',
            'academic_year_id.exists' => 'Tahun ajaran tidak ditemukan',
            'semester_id.required' => 'Semester harus diisi',
            'semester_id.exists' => 'Semester tidak ditemukan',
        ];
    }
}
