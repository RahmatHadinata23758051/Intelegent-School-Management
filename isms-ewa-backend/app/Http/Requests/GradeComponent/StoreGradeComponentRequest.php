<?php

namespace App\Http\Requests\GradeComponent;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeComponentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'code' => 'required|string|max:50|unique:grade_components,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'default_weight' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Kode komponen nilai wajib diisi',
            'code.unique' => 'Kode komponen nilai sudah digunakan',
            'name.required' => 'Nama komponen nilai wajib diisi',
            'default_weight.min' => 'Bobot minimal 0',
            'default_weight.max' => 'Bobot maksimal 100',
        ];
    }
}
