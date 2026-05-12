<?php

namespace App\Http\Requests\AttendanceSession;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceSessionRequest extends FormRequest
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
            'notes' => ['nullable', 'string'],
            'is_locked' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $attendanceSession = $this->route('attendanceSession');

            // Prevent updating locked session
            if ($attendanceSession && $attendanceSession->is_locked && !$this->has('is_locked')) {
                $validator->errors()->add('is_locked', 'Sesi absensi terkunci tidak dapat diubah.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'notes.string' => 'Catatan harus berupa teks.',
            'is_locked.boolean' => 'Status kunci harus berupa boolean.',
        ];
    }
}
