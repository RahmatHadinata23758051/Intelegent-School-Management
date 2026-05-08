<?php

namespace App\Http\Requests\ClassSubject;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClassSubjectRequest extends FormRequest
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
            'subject_id' => [
                'required',
                'exists:subjects,id',
                Rule::exists('subjects', 'id')->where('is_active', true),
            ],
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'school_class_id.required' => 'Kelas harus dipilih',
            'school_class_id.exists' => 'Kelas tidak ditemukan',
            'subject_id.required' => 'Mata pelajaran harus dipilih',
            'subject_id.exists' => 'Mata pelajaran tidak ditemukan atau tidak aktif',
        ];
    }
}
