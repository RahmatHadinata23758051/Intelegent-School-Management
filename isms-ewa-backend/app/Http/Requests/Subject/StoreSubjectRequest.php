<?php

namespace App\Http\Requests\Subject;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
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
            'code' => 'required|string|max:50|unique:subjects,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credit_hours' => 'nullable|integer|min:1|max:20',
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Kode mata pelajaran harus diisi',
            'code.unique' => 'Kode mata pelajaran sudah terdaftar',
            'code.max' => 'Kode mata pelajaran maksimal 50 karakter',
            'name.required' => 'Nama mata pelajaran harus diisi',
            'name.max' => 'Nama mata pelajaran maksimal 255 karakter',
            'credit_hours.min' => 'Jumlah SKS minimal 1',
            'credit_hours.max' => 'Jumlah SKS maksimal 20',
        ];
    }
}
