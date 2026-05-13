<?php

namespace App\Http\Requests\ReportCard;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportCardRequest extends FormRequest
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
            'notes' => 'nullable|string|max:1000',
            'homeroom_notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'notes.string' => 'Catatan harus berupa teks',
            'notes.max' => 'Catatan maksimal 1000 karakter',
            'homeroom_notes.string' => 'Catatan wali kelas harus berupa teks',
            'homeroom_notes.max' => 'Catatan wali kelas maksimal 1000 karakter',
        ];
    }
}
