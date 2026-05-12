<?php

namespace App\Http\Requests\Attendance;

use App\Models\Attendance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceRequest extends FormRequest
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
            'status' => ['required', Rule::in(Attendance::getValidStatuses())],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $attendance = $this->route('attendance');

            // Validate session is not locked
            if ($attendance && $attendance->attendanceSession && $attendance->attendanceSession->is_locked) {
                $validator->errors()->add('status', 'Sesi absensi terkunci tidak dapat diubah.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status absensi wajib diisi.',
            'status.in' => 'Status absensi tidak valid.',
        ];
    }
}
