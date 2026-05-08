<?php

namespace App\Http\Requests\TeacherProfile;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreTeacherProfileRequest extends FormRequest
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
        return [
            'user_id' => 'required|exists:users,id|unique:teacher_profiles,user_id',
            'nip' => 'nullable|string|max:50|unique:teacher_profiles,nip',
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
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = User::find($this->user_id);
            if ($user && !$user->canHaveTeacherProfile()) {
                $validator->errors()->add('user_id', 'User harus memiliki role teacher atau homeroom_teacher');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'User wajib dipilih',
            'user_id.exists' => 'User tidak ditemukan',
            'user_id.unique' => 'User sudah memiliki teacher profile',
            'nip.unique' => 'NIP sudah digunakan',
            'employment_status.in' => 'Employment status tidak valid',
            'joined_date.date' => 'Format tanggal tidak valid',
        ];
    }
}
