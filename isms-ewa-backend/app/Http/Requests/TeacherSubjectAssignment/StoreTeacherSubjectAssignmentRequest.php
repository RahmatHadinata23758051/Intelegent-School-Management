<?php

namespace App\Http\Requests\TeacherSubjectAssignment;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherSubjectAssignmentRequest extends FormRequest
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
            'teacher_profile_id' => 'required|exists:teacher_profiles,id',
            'class_subject_id' => 'required|exists:class_subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'teacher_profile_id.required' => 'ID profil guru wajib diisi',
            'teacher_profile_id.exists' => 'Profil guru tidak ditemukan',
            'class_subject_id.required' => 'ID penugasan kelas-mata pelajaran wajib diisi',
            'class_subject_id.exists' => 'Penugasan kelas-mata pelajaran tidak ditemukan',
            'academic_year_id.required' => 'ID tahun ajaran wajib diisi',
            'academic_year_id.exists' => 'Tahun ajaran tidak ditemukan',
            'is_active.boolean' => 'Status harus berupa boolean',
        ];
    }
}
