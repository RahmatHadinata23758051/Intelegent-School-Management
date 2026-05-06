<?php

namespace App\Http\Requests\Violation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateViolationRequest extends FormRequest
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
            'description' => 'sometimes|required|string',
            'severity' => 'sometimes|required|string|in:minor,moderate,major,severe',
            'reported_by' => 'nullable|exists:users,id',
            'reported_date' => 'sometimes|required|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'description.required' => 'Deskripsi pelanggaran harus diisi.',
            'description.string' => 'Deskripsi pelanggaran harus berupa teks.',
            'severity.required' => 'Tingkat keparahan harus diisi.',
            'severity.in' => 'Tingkat keparahan harus minor, moderate, major, atau severe.',
            'reported_by.exists' => 'Pelapor tidak ditemukan.',
            'reported_date.required' => 'Tanggal pelaporan harus diisi.',
            'reported_date.date' => 'Format tanggal pelaporan tidak valid.',
        ];
    }
}
