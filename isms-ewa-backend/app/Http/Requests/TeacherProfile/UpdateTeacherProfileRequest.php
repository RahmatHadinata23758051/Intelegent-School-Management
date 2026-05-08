<?php

namespace App\Http\Requests\TeacherProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherProfileRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $teacherId = $this->route('teacher');
        
        return [
            'nip' => 'nullable|string|max:50|unique:teacher_profiles,nip,' . $teacherId,
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'employment_status' => 'nullable|string|in:permanent,contract,honorary,intern',
            'joined_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nip.unique' => 'NIP sudah digunakan',
            'employment_status.in' => 'Employment status tidak valid',
            'joined_date.date' => 'Format tanggal tidak valid',
        ];
    }
}
