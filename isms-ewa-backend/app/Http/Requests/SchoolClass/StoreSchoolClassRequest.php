<?php

namespace App\Http\Requests\SchoolClass;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolClassRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama kelas harus diisi.',
            'name.string' => 'Nama kelas harus berupa teks.',
            'name.max' => 'Nama kelas maksimal 255 karakter.',
            'grade_level.required' => 'Tingkat kelas harus diisi.',
            'grade_level.string' => 'Tingkat kelas harus berupa teks.',
            'grade_level.max' => 'Tingkat kelas maksimal 50 karakter.',
            'homeroom_teacher_id.exists' => 'Guru tidak ditemukan.',
        ];
    }
}
