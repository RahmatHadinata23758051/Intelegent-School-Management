<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'school_class_id' => 'required|exists:school_classes,id',
            'student_id' => 'required|string|max:50|unique:students,student_id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email',
            'gender' => 'nullable|string|in:male,female',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'school_class_id.required' => 'Kelas harus diisi.',
            'school_class_id.exists' => 'Kelas tidak ditemukan.',
            'student_id.required' => 'NIS harus diisi.',
            'student_id.string' => 'NIS harus berupa teks.',
            'student_id.max' => 'NIS maksimal 50 karakter.',
            'student_id.unique' => 'NIS sudah terdaftar.',
            'name.required' => 'Nama siswa harus diisi.',
            'name.string' => 'Nama siswa harus berupa teks.',
            'name.max' => 'Nama siswa maksimal 255 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'gender.in' => 'Jenis kelamin harus male atau female.',
            'birth_date.date' => 'Format tanggal lahir tidak valid.',
        ];
    }
}
